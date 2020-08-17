import path from 'path';
import { Sequelize } from 'sequelize';

type SqlDialect = 'mysql'|'sqlite'|'mariadb'|'postgres'|'mssql';

const sqlDialect = process.env.SQL_DIALECT || 'sqlite';
const SQL_NAME = process.env.SQL_NAME
  ? `${process.env.SQL_NAME}`
  : `node-ts-starter_${process.env.NODE_ENV || ''}`;

export default () => new Sequelize(
  SQL_NAME,
  `${process.env.SQL_USERNAME || ''}`,
  `${process.env.SQL_PASSWORD || ''}`,
  {
    dialect: (sqlDialect as SqlDialect),
    host: `${process.env.SQL_HOST || ''}`,

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
