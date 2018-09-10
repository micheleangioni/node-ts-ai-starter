import express from 'express';
import usersRouter from './users';

export default function (app: express.Application) {
  app.use('/api/users', usersRouter(app));
}
