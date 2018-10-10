import express from 'express';
import usersSchema from './usersSchema';

export default function (app: express.Application) {
  const sequelize = app.get('sqlClient');

  return usersSchema(sequelize);
}
