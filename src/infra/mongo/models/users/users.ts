import express from 'express';
import userSchemaCreator from './usersSchema';
import {Model, Mongoose} from 'mongoose';

export default (app: express.Application) => {
  const mongoose = app.get('mongooseClient') as Mongoose;
  const usersSchema = userSchemaCreator(mongoose);
  let model: Model<any>;

  // The following tweak allows for seeding in testing directly using Mongoose to handle DB operations
  try {
    model = mongoose.model('users', usersSchema);
  } catch (error) {
    model = mongoose.model('users');
  }

  return model;
};
