import express from 'express';

import usersModel from './users';

export default function (app: express.Application) {
  app.set('usersModel', usersModel(app));
}
