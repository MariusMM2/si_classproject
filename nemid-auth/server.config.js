const config = {}

config.port = process.env.PORT || 3001;
config.dbName = "nemid-auth.sqlite";
config.dbLocation = `../db/${config.dbName}`;
config.nemidApiString = process.env.API_STRING || "http://localhost:3000";

config.dbState = {
    pending: 1,
    successful: 2,
    failed: 3
};

config.locale = 'da-DK';

module.exports = config;