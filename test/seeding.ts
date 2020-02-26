import mongoose from 'mongoose';
import path from 'path';
import SequelizeLibrary from 'sequelize';
import Umzug from 'umzug';
import userSchemaCreator from '../src/infra/mongo/models/users/usersSchema';
import userRepoCreator from '../src/infra/repositories/userRepo';
import Sequelize from '../src/infra/sql';
import User from '../src/infra/sql/models/users/user';
import { attributes, tableName } from '../src/infra/sql/models/users/usersSchema';
import usersData from './testData/users.json';

// Connect to mongoose
const mongoUri = process.env.MONGO_URI
  ? process.env.MONGO_URI
  : `mongodb://localhost:27017/node-ts-starter_${process.env.NODE_ENV}`;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((e: any) => {
    throw e;
  });

// Connect to SqLite
const sequelize = Sequelize();

const umzug = new Umzug({
  storage: 'sequelize',

  storageOptions: {
    sequelize,
  },

  migrations: {
    params: [
      sequelize.getQueryInterface(),
      SequelizeLibrary,
    ],
    path: path.join(__dirname, '../migrations'),
  },
});

// Connect to MongoDB using Mongoose and attach the models to it
const mongooseClient: any = mongoose;

const userSchema = userSchemaCreator(mongooseClient);
const userModel = mongoose.model('users', userSchema);

export const userRepo = userRepoCreator(userModel);

export const seedDatabase = async () => {
  // Mongo
  await userModel.insertMany(usersData);

  // SqLite migrations and seedings
  User.init(attributes, {
    sequelize,
    tableName,
  });

  await umzug.up();
  await User.bulkCreate(usersData);
};

export const cleanDatabase = async () => {
  await userModel.remove({});
  await umzug.down();
};
