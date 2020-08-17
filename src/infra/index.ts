import brokerFactory from '@micheleangioni/node-messagebrokers';
import { Application } from 'express';
import config from '../config';
import EventPublisher from '../application/eventPublisher';
import Logger from './logger';
import mongoose from './mongo';
import models from './mongo/models/models';
import SqlUserRepo from './repositories/sqlUserRepo';
import UserRepo from './repositories/userRepo';
import Sequelize from './sql';
import sqlModels from './sql/models/models';

export default async (app: Application) => {
  // Add logger
  const logger = new Logger();
  app.set('logger', logger);

  // If MongoDB is active, add Mongoose and its models

  app.set('mongooseClient', mongoose);
  models(app);

  // Add repositories
  app.set('userRepo', UserRepo(app.get('userModel')));

  // If a SQL dialect is set, add Sequelize, its models and repos

  if (process.env.SQL_DIALECT !== 'none') {
    app.set('sqlClient', Sequelize());
    sqlModels(app);

    app.set('sqlUserRepo', SqlUserRepo());
  }

  if (process.env.ENABLE_MESSAGE_BROKER === 'true') {
    const kafkaBroker = brokerFactory(config.kafka.topics);

    try {
      await kafkaBroker.init();
    } catch (err) {
      const error = {
        error: err as Error,
        message: `Kafka topics creation error: ${(err as Error).toString()}`,
        type: 'kafka',
      };

      logger.fatal(error);

      throw err;
    }

    logger.info('Kafka Broker successfully initialized');
    const eventPublisher = new EventPublisher(kafkaBroker, logger);
    app.set('messageBroker', eventPublisher);
  }
};
