import express from 'express';
import chatRouter from './chat';
import usersRouter from './users';

export default async (app: express.Application) => {
  const chatSource = '/api/chat';
  app.use(chatSource, chatRouter(app, chatSource));

  const usersSource = '/api/users';
  app.use(usersSource, usersRouter(app, usersSource));

  return Promise.resolve();
};
