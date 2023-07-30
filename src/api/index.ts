import {FastifyInstance} from 'fastify';
import llmRouter from './llm';
import usersRouter from './users';

export default async (app: FastifyInstance) => {
  const llmSource = '/api/llm';
  llmRouter(app, llmSource);

  const usersSource = '/api/users';
  usersRouter(app, usersSource);

  return Promise.resolve();
};
