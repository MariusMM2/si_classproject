const config = {}

config.port = process.env.PORT || 3000;
config.dbName = "nemid.sqlite";
config.dbLocation = `../db/${config.dbName}`;

config.locale = 'da-DK';

module.exports = config;