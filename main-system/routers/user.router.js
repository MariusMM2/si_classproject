const sqlite3 = require("sqlite3");
const axios = require('axios');
const config = require("../server.config");
const {parseString, parseDate, parseInteger, inputValidator} = require("../middleware/inputParsing");
const {authGuard} = require("../middleware/auth");
const {generateDigitString} = require("../utils/math.util");
const router = require('express').Router();


const db = new sqlite3.Database(config.dbLocation);
db.get("PRAGMA foreign_keys = ON");

router.post('/',
    // ensure authentication is provided and valid
    authGuard,
    // 'firstName' body attribute
    parseString('firstName', {min: 1, max: 40}),
    // 'lastName' body attribute
    parseString('lastName', {min: 1, max: 40}),
    // 'dateOfBirth' body attribute
    parseDate('dateOfBirth'),
    // 'email' body attribute,
    parseString('email', {min: 1, max: 40}),
    // validate above attributes
    inputValidator,
    async (req, res) => {
        const {lastName, firstName, dateOfBirth, email} = req.body;

        const existingEmailQuery = `SELECT TRUE
                                    FROM main.User
                                    WHERE Email = ?`;

        let existingEmailResult;
        try {
            existingEmailResult = await new Promise((resolve, reject) => {
                db.get(existingEmailQuery, [email], (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                })
            })
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }

        if (existingEmailResult) {
            return res.status(409).json("email already exists in the database");
        }

        let [year, month, day] = dateOfBirth.split('-');
        year = year.substring(2);

        const cpr = day + month + year + generateDigitString(4);

        const nemId = generateDigitString(3) + cpr.substring(7) + generateDigitString(3);

        const insertUserQuery = `INSERT INTO main.User(FirstName, LastName, DateOfBirth, Cpr, Email, NemId)
                                 VALUES (?, ?, ?, ?, ?, ?)`;

        let insertUserResult;
        try {
            insertUserResult = await new Promise((resolve, reject) => {
                db.run(insertUserQuery,
                    [firstName, lastName, dateOfBirth, cpr, email, nemId],
                    function (err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(this);
                        }
                    })
            })
        } catch (e) {
            if (e.message.includes("UNIQUE")) {
                return res.status(409).json("cpr already exists in the database");
            }

            console.log(e);
            return res.sendStatus(500);
        }

        if (!insertUserResult.lastID) {
            return res.status(500).json("unable to create user");
        }

        try {
            await axios.post(`${config.nemidGatewayString}/user`, {nemId, cpr, genderId: 1, email})
        } catch (e) {
            if (e.response) {
                if (e.response.status === 400) {
                    return res.status(400).json("invalid arguments");
                } else if (e.response.status === 409) {
                    return res.status(409).json("user with the same [attributes?] already exists");
                } else if (e.response.status === 422) {
                    return res.status(422).json("provided genderId is invalid");
                }
            }

            console.log(e);
            return res.sendStatus(500);
        }

        let userResult;
        try {
            userResult = await axios.get(`http://localhost:${config.port}/user/${insertUserResult.lastID}`);
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }

        res.status(201).json(userResult.data);
    });

router.get('/:id',
    // ensure authentication is provided and valid
    authGuard,
    // 'id' query param
    parseInteger('id'),
    // validate above attribute
    inputValidator,
    (req, res) => {
        const query = `SELECT *
                       FROM main.User
                       WHERE Id = ?`;

        db.get(query, [req.params.id], (err, row) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            } else if (row === undefined) {
                return res.sendStatus(404);
            }

            res.json(row);
        });
    });

// user delete
router.delete('/:id',
    // ensure authentication is provided and valid
    authGuard,
    // 'id' query param
    parseInteger('id'),
    // validate above attribute
    inputValidator,
    async (req, res) => {
        // retrieve full user details
        let user;
        try {
            user = (await axios.get(`http://localhost:${config.port}/user/${req.params.id}`)).data;
        } catch (e) {
            console.warn("catch at retrieve full user details");
            if (e.response) {
                if (e.response.status === 404) {
                    return res.sendStatus(404);
                }
            }

            console.log(e);
            return res.sendStatus(500);
        }

        // delete user from userDb
        const deleteUserQuery = `DELETE
                                 FROM main.User
                                 WHERE Id = ?`;

        let deleteUserResult;
        try {
            deleteUserResult = await new Promise((resolve, reject) => {
                db.run(deleteUserQuery, [req.params.id], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this);
                    }
                })
            })
        } catch (e) {
            console.warn("catch at delete user from userDb");
            console.log(e);
            return res.sendStatus(500);
        }

        if (deleteUserResult.changes === 0) {
            console.log("unable to delete user");
            return res.sendStatus(500);
        }

        // delete user from passwordDb
        try {
            const passwordDbUsers = (await axios.get(`${config.nemidGatewayString}/user`)).data;
            console.log(passwordDbUsers);
            const passwordDbUser = passwordDbUsers.find(passwordDbUser => passwordDbUser.NemId === user.NemId);
            console.log(passwordDbUser);
            await axios.delete(`${config.nemidGatewayString}/user/${passwordDbUser.Id}`);
        } catch (e) {
            console.warn("catch at delete user from passwordDb");
            if (e.response) {
                if (e.response.status === 404) {
                    console.warn(`user with id ${req.params.id} not found`);
                }
            } else {
                console.log(e);
                return res.sendStatus(500);
            }
        }

        // delete user nemid references from tokenDb
        try {
            await axios.delete(`${config.nemidGatewayString}/delete-user`, {params: {nemId: user.NemId}});
        } catch (e) {
            console.warn("catch at delete user nemid references from tokenDb");
            if (e.response) {
                if (e.response.status === 404) {
                    console.warn(`user with id ${req.params.id} not found`);
                }
            } else {
                console.log(e);
                return res.sendStatus(500);
            }
        }

        return res.sendStatus(204);
    });

module.exports = router;