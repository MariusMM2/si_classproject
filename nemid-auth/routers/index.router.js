const sqlite3 = require("sqlite3");
const axios = require('axios');
const {parseString, inputValidator} = require("../middleware/inputParsing");
const config = require("../server.config");
const router = require('express').Router();

const db = new sqlite3.Database(config.dbLocation);
db.get("PRAGMA foreign_keys = ON");

router.post('/login',
    // 'nemId' body attribute
    parseString('nemId', {min: 1, max: 20}),
    // 'password' body attribute
    parseString('password', {min: 1, max: 50}),
    // validate above attribute
    inputValidator,
    async (req, res) => {
        try {
            (await axios.post(`${config.nemidApiString}/authenticate`, req.body)).data;
        } catch (e) {
            if (e.response) {
                if (e.response.status === 403) {
                    return res.status(403).json(e.response.data);
                }
            }

            console.log(e);
            return res.sendStatus(500);
        }

        const generatedCode = Math.floor(Math.random() * 999999 + 100000);

        const authAttemptQuery = `INSERT INTO main.AuthAttempt (StateId, NemId, GeneratedCode)
                                  VALUES (?, ?, ?)`;

        try {
            await new Promise((resolve, reject) => {
                db.run(authAttemptQuery, [config.dbState.pending, req.body.nemId, generatedCode], function (err) {
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

        return res.sendStatus(204);
    });

module.exports = router;