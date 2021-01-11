/**
 * This file contains the dictionary object of authenticated users,
 * as well as helper methods related to authentication.
 */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../server.config");

/**
 * Takes in a password string and returns the bcrypt hash value of that password.
 * @param {string} password - The password
 * @returns {string} hash value. of the password
 */
function getHashedPassword(password) {
    return bcrypt.hashSync(password, 10);
}

/**
 * Uses {@link bcrypt.compareSync} to test whether or not
 * the given password matches the given hash value.
 * @param {string} password - The password
 * @param {string} hash - The hash value
 * @returns {boolean} True if they match, false otherwise
 */
function confirmPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

/**
 * Generates a Json Web Token with the provided payload.
 * @param payload Payload to sign
 * @return {string} Token
 */
function jwtSign(payload) {
    return jwt.sign(
        payload,
        config.jwtSecretKey,
        {
            algorithm: config.jwtSecretType
        }
    )
}

module.exports = {
    getHashedPassword,
    confirmPassword,
    jwtSign,
};