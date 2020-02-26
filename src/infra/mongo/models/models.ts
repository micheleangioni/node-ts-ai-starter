import express from 'express';
import usersModel from './users/users';

export default (app: express.Application) => {
  app.set('userModel', usersModel(app));
};
