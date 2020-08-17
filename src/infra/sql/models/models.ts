import express from 'express';
import {Sequelize} from 'sequelize';
import usersSchema from './users/usersSchema';

export default (app: express.Application) => {
  // Init models
  usersSchema(app.get('sqlClient') as Sequelize);
};
