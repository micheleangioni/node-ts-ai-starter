import express from 'express';
import mongoose from './mongo';
import models from './mongo/models/models';
import UserRepo from './repositories/userRepo';

export default function (app: express.Application) {
  // Add Mongoose and its models
  app.set('mongooseClient', mongoose);
  models(app);

  // Add repositories
  app.set('userRepo', UserRepo(app.get('userModel')));
}
