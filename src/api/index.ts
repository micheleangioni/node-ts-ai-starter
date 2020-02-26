import express from 'express';
import usersRouter from './users';

export default async (app: express.Application) => {
  const source = '/api/users';
  app.use(source, usersRouter(app, source));

  return Promise.resolve();
};
