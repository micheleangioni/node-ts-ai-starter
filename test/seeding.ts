import mongoose from 'mongoose';
import userSchemaCreator from '../src/infra/mongo/models/users/usersSchema';
import UserRepo from '../src/infra/repositories/userRepo';
import usersData from './testData/users.json';

process.env.OPENAI_ORGANIZATION_ID =  'organizationId';
process.env.OPENAI_API_KEY = 'key';

// Connect to mongoose
const mongoUri = process.env.MONGO_URI
  ? process.env.MONGO_URI
  : `mongodb://localhost:27017/node-ts-starter_${process.env.NODE_ENV}`;

mongoose.connect(mongoUri, {})
  .catch((e: any) => {
    throw e;
  });

// Connect to MongoDB using Mongoose and attach the models to it
const mongooseClient: any = mongoose;

const userSchema = userSchemaCreator(mongooseClient);
const userModel = mongoose.model('users', userSchema) as any;

export const userRepo = new UserRepo(userModel);

export const seedDatabase = async () => {
  // Mongo
  await userModel.insertMany(usersData);
};

export const cleanDatabase = async () => {
  await userModel.deleteMany({});
};
