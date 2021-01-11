const sqlite3 = require("sqlite3");
const axios = require('axios');
const {parseString, parseInteger, inputValidator} = require("../middleware/inputParsing");
const {toSqlDatetime} = require("../utils/hash.util");
const config = require("../server.config");
const router = require('express').Router();

const db = new sqlite3.Database(config.dbLocation);
db.get("PRAGMA foreign_keys = ON");

// user create
router.post('/',
    // 'nemId' body attribute
    parseString('nemId', {min: 1, max: 20}),
    // 'cpr' body attribute
    parseString('cpr', {min: 1, max: 20}),
    // 'genderId' body attribute
    parseInteger('genderId'),
    // 'email' body attribute
    parseString('email', {min: 1, max: 40}),
    //validate above attribute
    inputValidator,
    async (req, res) => {
        const query = `INSERT INTO main.User(NemId, Cpr, GenderId, Email)
                       VALUES (?, ?, ?, ?)`;

        let result;
        try {
            result = await new Promise((resolve, reject) => {
                db.run(query, [req.body.nemId, req.body.cpr, req.body.genderId, req.body.email], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this);
                    }
                })
            })
        } catch (e) {
            if (e.code === "SQLITE_CONSTRAINT") { // SQL constraint failed
                if (e.message.includes("FOREIGN KEY")) {
                    return res.status(422).json("invalid genderId");
                } else if (e.message.includes("UNIQUE")) {
                    return res.status(409).json("cpr already exists in the database");
                }
            }

            console.log(e);
            return res.sendStatus(500);
        }

        try {
            const newUser = (await axios.get(`http://localhost:${config.port}/user/${result.lastID}`)).data;
            res.status(201).json(newUser);
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
    });

// user read one
router.get('/:id',
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

// user read all
router.get('/', (req, res) => {
    const query = `SELECT *
                   FROM main.User`;

    db.all(query, (err, rows) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else if (rows === 0) {
            return res.sendStatus(404);
        }

        res.json(rows);
    });
});

// user update
router.put('/:id',
    // 'id' query param
    parseInteger('id'),
    // 'nemId' body attribute
    parseString('nemId', {min: 1, max: 20}),
    // 'cpr' body attribute
    parseString('cpr', {min: 1, max: 20}),
    // 'genderId' body attribute
    parseInteger('genderId'),
    // 'email' body attribute
    parseString('email', {min: 1, max: 40}),
    //validate above attribute
    inputValidator,
    async (req, res) => {
        const query = `UPDATE main.User
                       SET NemId      = ?,
                           Cpr        = ?,
                           GenderId   = ?,
                           Email      = ?,
                           ModifiedAt = ?
                       WHERE Id = ?`;

        let result;
        try {
            result = await new Promise((resolve, reject) => {
                db.run(query, [req.body.nemId, req.body.cpr, req.body.genderId, req.body.email, toSqlDatetime(new Date()), req.params.id], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this);
                    }
                })
            })
        } catch (e) {
            if (e.code === "SQLITE_CONSTRAINT") { // SQL constraint failed
                if (e.message.includes("FOREIGN KEY")) {
                    return res.status(422).json("invalid genderId");
                } else if (e.message.includes("UNIQUE")) {
                    return res.status(409).json("cpr already exists in the database");
                }
            }

            console.log(e);
            return res.sendStatus(500);
        }

        if (result.changes === 0) {
            try {
                const newUser = (await axios.post(`http://localhost:${config.port}/user/`, {
                    nemId: req.body.nemId,
                    cpr: req.body.cpr,
                    genderId: req.body.genderId,
                    email: req.body.email,
                })).data;

                return res.status(201).json(newUser);
            } catch (e) {
                if (e.response) {
                    if (e.response.status === 409) {
                        return res.status(409).json(e.response.data);
                    }
                }

                console.log(e);
                return res.sendStatus(500);
            }
        }

        return res.sendStatus(204);
    });

// user delete
router.delete('/:id',
    // 'id' query param
    parseInteger('id'),
    // validate above attribute
    inputValidator,
    (req, res) => {
        const query = `DELETE
                       FROM main.User
                       WHERE Id = ?`;

        db.run(query, [req.params.id], function (err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            } else if (this.changes === 0) {
                return res.sendStatus(404);
            }

            res.sendStatus(204);
        });
    });

module.exports = router;