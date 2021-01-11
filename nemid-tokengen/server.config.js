const config = {}

config.port = process.env.PORT || 3001;
config.dbName = "tokenDb.sqlite";
config.dbLocation = `../db/${config.dbName}`;
config.jwtSecretKey = process.env.JWT_SECRET_KEY;
config.jwtSecretType = process.env.JWT_SECRET_TYPE;

config.dbState = {
    pending: 1,
    successful: 2,
    failed: 3
};

config.locale = 'da-DK';

module.exports = config;