const config = {}

config.port = process.env.PORT || 3000;
config.dbName = "userDb.sqlite";
config.dbLocation = `../db/${config.dbName}`;
config.nemidAuthString = process.env.AUTH_STRING || "http://localhost:3001";
config.nemidApiString = process.env.API_STRING || "http://localhost:3000";
config.nemidGatewayString = process.env.GATEWAY_STRING || "http://localhost:3010";

config.locale = 'da-DK';

module.exports = config;