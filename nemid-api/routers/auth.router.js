const sqlite3 = require("sqlite3");
const axios = require('axios');
const {parseString, inputValidator} = require("../middleware/inputParsing");
const {confirmPassword} = require("../utils/hash.util");
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
                                            INNER JOIN Password ON User.Id = Password.UserId AND User.NemId = ?`;

        let passwordRows;
        try {
            passwordRows = await new Promise((resolve, reject) => {
                db.all(userPasswordQuery, [req.body.nemId], function (err, dbRows) {
                    if (err) {
                        reject(new Error(err));
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

module.exports = router;