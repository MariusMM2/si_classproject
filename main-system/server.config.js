const config = {}

config.port = process.env.PORT || 3000;
config.dbName = "tokenDb.sqlite";
config.dbLocation = `../db/${config.dbName}`;
config.nemidAuthString = process.env.AUTH_STRING || "http://localhost:3001";
config.nemidApiString = process.env.API_STRING || "http://localhost:3000";

config.locale = 'da-DK';

module.exports = config;