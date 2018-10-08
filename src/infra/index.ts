import express from 'express';
import mongoose from './mongo';
import models from './mongo/models/models';
import SqlUserRepo from './repositories/sqlUserRepo';
import UserRepo from './repositories/userRepo';
import Sequelize from './sql';
import sqlModels from './sql/models/models';

export default function (app: express.Application) {
  // If MongoDB is active, add Mongoose and its models

  if (process.env.DB_ACTIVE === 'true') {
    app.set('mongooseClient', mongoose);
    models(app);

    // Add repositories
    app.set('userRepo', UserRepo(app.get('userModel')));
  }

  // If a SQL dialect is set, add Sequelize, its models and repos

  if (process.env.SQL_DIALECT !== 'none') {
    app.set('sqlClient', Sequelize());
    sqlModels(app);

    app.set('sqlUserRepo', SqlUserRepo(app.get('sqlUserModel')));
  }
}
