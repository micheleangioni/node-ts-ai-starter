import { Application } from 'express';
import UserService from './user/userService';

export default async (app: Application) => {
  // Add application services

  app.set('userService', new UserService(app.get('userRepo'), app.get('messageBroker')));

  return Promise.resolve();
};
