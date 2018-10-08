import express from 'express';

import usersModel from './users/users';

export default function (app: express.Application) {
  app.set('sqlUserModel', usersModel(app));
}
