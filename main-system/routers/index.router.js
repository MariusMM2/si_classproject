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
        let result;
        try {
            result = (await axios.post(`${config.nemidGatewayString}/authenticate`, req.body));
        } catch (e) {
            if (e.response) {
                if (e.response.status === 403) {
                    return res.status(403).json(e.response.data);
                }
            }

            console.log(e);
            return res.sendStatus(500);
        }

        if (result.status === 204) {
            return res.sendStatus(204);
        }

        return res.sendStatus(500);
    });

router.put('/reset-nem-id-password',
    // ensure authentication is provided and valid
    authGuard,
    // 'cpr' body attribute
    parseString('cpr', {min: 1, max: 20}),
    // 'password' body attribute
    parseString('password', {min: 1, max: 50}),
    // validate above attributes
    inputValidator,
    apiWrapperMw("reset-password"));

router.put('/change-nem-id-password',
    // ensure authentication is provided and valid
    authGuard,
    // 'nemId' body attribute
    parseString('nemId', {min: 1, max: 20}),
    // 'oldPassword' body attributes
    parseString('oldPassword', {min: 1, max: 50}),
    // 'newPassword' body attribute
    parseString('newPassword', {min: 1, max: 50}),
    // validate above attribute
    inputValidator,
    apiWrapperMw("change-password"));

module.exports = router;

function apiWrapperMw(endpoint) {
    return async (req, res) => {
        try {
            await axios.put(`${config.nemidGatewayString}/${endpoint}`, req.body);
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