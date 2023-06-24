import express from 'express';
import llmRouter from './llm';
import usersRouter from './users';

export default async (app: express.Application) => {
  const llmSource = '/api/llm';
  app.use(llmSource, llmRouter(app, llmSource));

  const usersSource = '/api/users';
  app.use(usersSource, usersRouter(app, usersSource));

  return Promise.resolve();
};
