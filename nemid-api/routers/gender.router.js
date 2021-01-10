const sqlite3 = require('sqlite3');
const axios = require('axios');
const {parseInteger} = require("../middleware/inputParsing");
const {parseString, inputValidator} = require("../middleware/inputParsing");
const config = require('../server.config');
const router = require('express').Router();

const db = new sqlite3.Database(config.dbLocation);
db.get("PRAGMA foreign_keys = ON");

// gender create
router.post('/',
    // 'gender' body attribute
    parseString('label', {min: 1, max: 20}),
    //validate above attribute
    inputValidator,
    async (req, res) => {
        const query = `INSERT INTO main.Gender(Label)
                       VALUES (?)`;

        let result;
        try {
            result = await new Promise((resolve, reject) => {
                db.run(query, [req.body.label], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this);
                    }
                })
            })
        } catch (e) {
            if (e.code === "SQLITE_CONSTRAINT") { // SQL constraint failed
                if (e.message.includes("UNIQUE")) {
                    return res.status(409).json("label already exists");
                }
            }

            console.log(e);
            return res.sendStatus(500);
        }

        try {
            const newGender = (await axios.get(`http://localhost:${config.port}/gender/${result.lastID}`)).data;
            res.status(201).json(newGender);
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
    });

// gender read one
router.get('/:id',
    // 'id' query param
    parseInteger('id'),
    // validate above attribute
    inputValidator,
    (req, res) => {
        const query = `SELECT *
                       FROM main.Gender
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

// gender read all
router.get('/', (req, res) => {
    const query = `SELECT *
                   FROM main.Gender`;

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

// gender update
router.put('/:id',
    // 'id' query param
    parseInteger('id'),
    // 'label' body attribute
    parseString('label', {min: 1, max: 20}),
    // validate above attributes
    inputValidator,
    async (req, res) => {
        const query = `UPDATE main.Gender
                       SET Label = ?
                       WHERE Id = ?`;

        let result;
        try {
            result = await new Promise((resolve, reject) => {
                db.run(query, [req.body.label, req.params.id], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this);
                    }
                })
            })
        } catch (e) {
            return res.sendStatus(500);
        }

        if (result.changes === 0) {
            try {
                const newUser = (await axios.post(`http://localhost:${config.port}/gender/`, {
                    label: req.body.label
                })).data;

                return res.status(201).json(newUser);
            } catch (e) {
                console.log(e);
                return res.sendStatus(500);
            }
        }

        return res.sendStatus(204);
    });

// gender delete
router.delete('/:id',
    // 'id' query param
    parseInteger('id'),
    // validate above attribute
    inputValidator,
    (req, res) => {
        const query = `DELETE
                       FROM main.Gender
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