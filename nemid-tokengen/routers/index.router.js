const sqlite3 = require("sqlite3");
const {parseString, inputValidator} = require("../middleware/inputParsing");
const config = require("../server.config");
const {jwtSign} = require("../utils/hash.util");
const router = require('express').Router();

const db = new sqlite3.Database(config.dbLocation);
db.get("PRAGMA foreign_keys = ON");

router.post('/generate-token',
    // 'nemId' body attribute
    parseString('nemId', {min: 1, max: 20}),
    // 'password' body attribute
    parseString('generatedCode', {min: 1, max: 50}),
    // validate above attribute
    inputValidator,
    async (req, res) => {
        const selectAuthAttemptQuery = `SELECT *
                                        FROM main.AuthAttempt
                                        WHERE NemId = ?
                                          AND GeneratedCode = ?
                                          AND CreatedAt > DATETIME(CURRENT_TIMESTAMP, '-5 minutes')`;

        let authAttemptResult;
        try {
            authAttemptResult = await new Promise((resolve, reject) => {
                db.get(selectAuthAttemptQuery, [req.body.nemId, req.body.generatedCode], function (err, row) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            });
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }

        if (!authAttemptResult) {
            return res.status(403).json("invalid credentials");
        }

        const token = jwtSign({
            nemId: req.body.nemId,
            generatedCode: req.body.generatedCode
        });

        const insertTokenQuery = `INSERT INTO main.Token(AuthAttemptId, Token)
                                  VALUES (?, ?)`;

        try {
            await new Promise((resolve, reject) => {
                db.run(insertTokenQuery, [authAttemptResult.Id, token], function (err) {
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

        const updateAuthAttemptQuery = `UPDATE main.AuthAttempt
                                        SET StateId = ?
                                        WHERE Id = ?`;

        try {
            await new Promise((resolve, reject) => {
                db.run(updateAuthAttemptQuery,
                    [config.dbState.successful, authAttemptResult.Id],
                    function (err) {
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

        return res.sendStatus(200);
    });

module.exports = router;
