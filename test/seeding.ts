// import mongoose from './../src/infra/mongo';
import mongoose from 'mongoose';
import userSchemaCreator from '../src/infra/mongo/models/users/usersSchema';
import usersData from './testData/users.json';

mongoose.connect(
  `${process.env.DB_ADAPTER}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:
    ${process.env.DB_PORT}/${process.env.DB_NAME}-${process.env.NODE_ENV}`, {useNewUrlParser: true})
  .catch((e: any) => {
    throw e;
  });

// Connect to MongoDB using Mongoose and attach the models to it
const mongooseClient: any = mongoose;

const userSchema = userSchemaCreator(mongooseClient);
const userModel = mongoose.model('users', userSchema);

export async function seedDatabase() {
  return userModel.insertMany(usersData);
}

export async function cleanDatabase() {
  return userModel.remove({});
}
