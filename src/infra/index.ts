import brokerFactory from '@micheleangioni/node-messagebrokers';
import {IContainer} from '../api/createIoCContainer';
import config from '../config';
import EventPublisher from '../application/eventPublisher';
import ILogger from './logger/ILogger';
import mongoose from './mongo';
import models from './mongo/models/models';
import UserRepo from './repositories/userRepo';

export default async (container: IContainer, logger: ILogger) => {
  // Add Mongoose and its models
  const { userModel } = models(mongoose);

  // Add repositories
  container.bind(UserRepo, () => new UserRepo(userModel));

  const kafkaBroker = brokerFactory(config.kafka.topics);

  try {
    if (process.env.ENABLE_MESSAGE_BROKER === 'true') {
      await kafkaBroker.init();
    }
  } catch (err) {
    logger.error(`Kafka topics creation error: ${(err as Error).toString()}`);

    throw err;
  }

  logger.info('Kafka Broker successfully initialized');
  container.bind(EventPublisher, () => new EventPublisher(kafkaBroker, logger));
};
