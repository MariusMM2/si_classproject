const axios = require("axios");
const config = require("../server.config");

async function authGuard(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).json("authentication credentials not provided");
    }

    const encodedAuth = req.headers.authorization.split(" ")[1];
    const decodedAuth = Buffer.from(encodedAuth, 'base64').toString('utf-8');

    const [nemId, password] = decodedAuth.split(':');

    let result;
    try {
        result = await axios.post(`${config.nemidApiString}/authenticate`, {nemId, password});
    } catch (e) {
        if (e.response) {
            if (e.response.status === 400 || e.response.status === 403) {
                return res.status(403).json("authentication credentials are invalid");
            }
        }

        console.log(e);
        return res.sendStatus(500);
    }

    if (result.status === 200) {
        console.log("auth ok");
        next();
    } else {
        return res.status(403).json("invalid credentials");
    }
}

module.exports = {
    authGuard,
}