const sqlite3 = require("sqlite3");
const axios = require('axios');
const {parseString, inputValidator} = require("../middleware/inputParsing");
const {getHashedPassword, confirmPassword} = require("../utils/hash.util");
const config = require("../server.config");
const router = require('express').Router();

const db = new sqlite3.Database(config.dbLocation);
db.get("PRAGMA foreign_keys = ON");

router.post('/authenticate',
    // 'nemId' body attribute
    parseString('nemId', {min: 1, max: 20}),
    // 'password' body attribute
    parseString('password', {min: 1, max: 50}),
    // validate above attribute
    inputValidator,
    async (req, res) => {
        const userPasswordQuery = `SELECT *
                                   FROM main.User
                                            INNER JOIN Password ON
                                           User.Id = Password.UserId AND
                                           User.NemId = ? AND
                                           Password.IsValid = TRUE`;

        let passwordRows;
        try {
            passwordRows = await new Promise((resolve, reject) => {
                db.all(userPasswordQuery, [req.body.nemId], function (err, dbRows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(dbRows);
                    }
                })
            })
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }

        const matchingPasswordRow = passwordRows.find(userPasswordRow => {
            return confirmPassword(req.body.password, userPasswordRow.PasswordHash);
        });

        if (!matchingPasswordRow) {
            // invalid nemId or password
            return res.status(403).json("invalid credentials");
        }

        try {
            const newUser = (await axios.get(`http://localhost:${config.port}/user/${matchingPasswordRow.UserId}`)).data;
            res.status(200).json(newUser);
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
    });

router.post('/change-password',
    // 'nemId' body attribute
    parseString('nemId', {min: 1, max: 20}),
    // 'oldPassword' body attribute
    parseString('oldPassword', {min: 1, max: 50}),
    // 'newPassword' body attribute
    parseString('newPassword', {min: 1, max: 50}),
    // validate above attribute
    inputValidator,
    async (req, res) => {
        let user;
        try {
            user = (await axios.post(`http://localhost:${config.port}/authenticate`, {
                nemId: req.body.nemId,
                password: req.body.oldPassword,
            })).data;
        } catch (e) {
            if (e.response) {
                if (e.response.status === 403) {
                    return res.status(403).json(e.response.data);
                }
            }

            console.log(e);
            return res.sendStatus(500);
        }

        const userPasswordsQuery = `SELECT *
                                    FROM Password
                                    WHERE UserId = ?
                                      AND IsValid = TRUE`;

        let userPasswordRows;
        try {
            userPasswordRows = await new Promise((resolve, reject) => {
                db.all(userPasswordsQuery, [user.Id], (err, dbRows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(dbRows);
                    }
                });
            });
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }

        const matchingOldPasswordRow = userPasswordRows.find(userPasswordRow => {
            return confirmPassword(req.body.oldPassword, userPasswordRow.PasswordHash);
        });

        const disablePasswordQuery = `UPDATE Password
                                      SET IsValid = FALSE
                                      WHERE Id = ?`;

        try {
            await new Promise((resolve, reject) => {
                db.run(disablePasswordQuery, [matchingOldPasswordRow.Id], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this);
                    }
                });
            });
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }

        const newPasswordQuery = `INSERT INTO Password(UserId, PasswordHash)
                                  VALUES (?, ?)`;

        try {
            await new Promise((resolve, reject) => {
                db.run(newPasswordQuery, [user.Id, getHashedPassword(req.body.newPassword)], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                })
            })
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }

        return res.sendStatus(201);
    });

router.post('/reset-password',
    // 'cpr' body attribute
    parseString('cpr', {min: 1, max: 20}),
    // 'password' body attribute
    parseString('password', {min: 1, max: 50}),
    // validate above attribute
    inputValidator,
    async (req, res) => {
        const userQuery = `SELECT *
                           FROM User
                           WHERE User.Cpr = ?`;

        let userRow;
        try {
            userRow = await new Promise((resolve, reject) => {
                db.get(userQuery, [req.body.cpr], (err, dbRow) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(dbRow);
                    }
                });
            });
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }

        if (!userRow) {
            return res.status(404).json("invalid CPR");
        }

        const disablePasswordsQuery = `UPDATE Password
                                       SET IsValid = FALSE
                                       WHERE UserId = ?`;

        try {
            await new Promise((resolve, reject) => {
                db.run(disablePasswordsQuery, [userRow.Id], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this);
                    }
                });
            });
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }

        const insertPasswordQuery = `INSERT INTO Password(UserId, PasswordHash)
                                     VALUES (?, ?)`;

        try {
            await new Promise((resolve, reject) => {
                db.run(insertPasswordQuery, [(userRow.Id), (getHashedPassword(req.body.password))], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this);
                    }
                })
            });
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }

        return res.sendStatus(201);
    });

module.exports = router;