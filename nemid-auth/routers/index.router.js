const sqlite3 = require("sqlite3");
const axios = require('axios');
const {parseString, inputValidator} = require("../middleware/inputParsing");
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

        // (000001, 999999)
        const generatedCode = Array.from({length: 6}, () => Math.floor(Math.random() * 10)).join('');

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

router.put('/change-password',
    // 'nemId' body attribute
    parseString('nemId', {min: 1, max: 20}),
    // 'oldPassword' body attribute
    parseString('oldPassword', {min: 1, max: 50}),
    // 'newPassword' body attribute
    parseString('newPassword', {min: 1, max: 50}),
    // validate above attribute
    inputValidator,
    apiWrapperMw("change-password"));

router.put('/reset-password',
    // 'cpr' body attribute
    parseString('cpr', {min: 1, max: 20}),
    // 'password' body attribute
    parseString('password', {min: 1, max: 50}),
    // validate above attribute
    inputValidator,
    apiWrapperMw("reset-password"));

router.delete('/delete-user',
    // 'nemId' query param
    parseString('nemId', {min: 9, max: 9}),
    // validate above attribute
    inputValidator,
    async (req, res) => {
        const deleteAuthAttemptsQuery = `DELETE
                                         FROM main.AuthAttempt
                                         WHERE NemId = ?`;

        let deleteAuthAttemptsResult;
        try {
            deleteAuthAttemptsResult = await new Promise((resolve, reject) => {
                db.run(deleteAuthAttemptsQuery, req.query.nemId, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this);
                    }
                })
            })
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }

        console.log(deleteAuthAttemptsResult);

        if (deleteAuthAttemptsResult.changes !== 0) {
            return res.sendStatus(204);
        }

        return res.status(404).json("nemId user not found");
    });

module.exports = router;

function apiWrapperMw(endpoint) {
    return async (req, res) => {
        try {
            await axios.put(`${config.nemidApiString}/${endpoint}`, req.body);
        } catch (e) {
            if (e.response) {
                if (e.response.status === 403) {
                    return res.status(403).json(e.response.data);
                } else if (e.response.status === 404) {
                    return res.status(404).json(e.response.data);
                }

                console.log(e.response);
                return res.sendStatus(500);
            }

            console.log(e);
            return res.sendStatus(500);
        }

        return res.sendStatus(200);
    }
}