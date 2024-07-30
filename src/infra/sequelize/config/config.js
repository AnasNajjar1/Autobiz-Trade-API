const envConfig = require('dotenv').config({ path: '.env' }).parsed;

const config = envConfig ? envConfig : process.env; //envConfig for migrate, process.env for running

const dbConnection = {
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  host: config.dbHost,
  dialect: 'mysql',
};

module.exports = {
  [config.env]: dbConnection,
};
module.exports.default = dbConnection;
