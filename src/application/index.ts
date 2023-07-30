import UserService from './user/userService';
import {IContainer} from '../api/createIoCContainer';
import UserRepo from '../infra/repositories/userRepo';
import EventPublisher from './eventPublisher';

export default async (container: IContainer) => {
  // Add application services

  container.bind(UserService, () => new UserService(container.resolve(UserRepo), container.resolve(EventPublisher)));

  return Promise.resolve();
};
