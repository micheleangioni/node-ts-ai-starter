const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

module.exports = {
  local: {
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_NAME,
    host: process.env.SQL_HOST,
    dialect: process.env.SQL_DIALECT
  },
  test: {
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: `${process.env.SQL_NAME}-test`,
    host: process.env.SQL_HOST,
    dialect: 'sqlite'
  },
  production: {
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_NAME,
    host: process.env.SQL_HOST,
    dialect: process.env.SQL_DIALECT
  }
};
