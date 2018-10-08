import path from 'path';
import Sequelize from 'sequelize';

export default () => new Sequelize(
  `${process.env.SQL_NAME}`,
  `${process.env.SQL_USERNAME}`,
  `${process.env.SQL_PASSWORD}`,
  {
    dialect: `${process.env.SQL_DIALECT}`, // 'mysql'|'sqlite'|'postgres'|'mssql'
    host: `${process.env.SQL_HOST}`,

    pool: {
      acquire: 30000,
      idle: 10000,
      max: 5,
      min: 0,
    },

    // SQLite only
    storage: path.join(__dirname, '../../../storage/db.sqlite'),

    logging: false,
  });
