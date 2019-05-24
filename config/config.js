const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  dev: {
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: `${process.env.SQL_NAME}_dev`,
    host: process.env.SQL_HOST,
    dialect: process.env.SQL_DIALECT
  },
  test: {
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: `${process.env.SQL_NAME}_test`,
    host: process.env.SQL_HOST,
    dialect: process.env.SQL_DIALECT
  },
  staging: {
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: `${process.env.SQL_NAME}_staging`,
    host: process.env.SQL_HOST,
    dialect: process.env.SQL_DIALECT
  },
  production: {
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: `${process.env.SQL_NAME}_production`,
    host: process.env.SQL_HOST,
    dialect: process.env.SQL_DIALECT
  }
};
