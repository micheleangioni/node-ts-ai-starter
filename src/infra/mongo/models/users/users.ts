import userSchemaCreator from './usersSchema';
import {Model, Mongoose} from 'mongoose';

export default (mongoose: Mongoose) => {
  const usersSchema = userSchemaCreator(mongoose);
  let model: Model<any, any, any>;

  // The following tweak allows for seeding in testing directly using Mongoose to handle DB operations
  try {
    model = mongoose.model('users', usersSchema);
  } catch (error) {
    model = mongoose.model('users');
  }

  return model;
};
