import express from 'express';
import mongoose from './mongo';
import models from './mongo/models/models';

export default function (app: express.Application) {
  app.set('mongooseClient', mongoose);
  models(app);
}
