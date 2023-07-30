import {FastifyInstance} from 'fastify';
import cors from '@fastify/cors';
import path from 'path';
import api from './api';
import createIoCContainer from './api/createIoCContainer';
import applicationServices from './application';

import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

import infraServices from './infra';

const registerPlugins = async (app: FastifyInstance) => {
  await app.register(cors, {
    allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With'],
    exposedHeaders: ['Authorization', 'Content-Type'],
    origin: '*',
  });
};

const loadApp = async (app: FastifyInstance) => {
  /**
   * TODO This is a simple implementation of an IoC.
   * For a better separation of API and Application layer, even if it comes with more complex code, better using
   * a full-fledged IoC like inversify.
   */
  const container = createIoCContainer();

  /**
   * Attach the infrastructure services to the Application.
   */
  await infraServices(container, app.log);

  /**
   * Attach the application services to the Application.
   */
  await applicationServices(container);

  /**
   * Attach the api services to the Application.
   */
  await api(app);

  return app;
};

export default async (app: FastifyInstance) => {
  // TODO HELMET

  await registerPlugins(app);
  await loadApp(app);

  return { app };
};
