import mongoose from 'mongoose';
import path from 'path';
import SequelizeLibrary from 'sequelize';
import Umzug from 'umzug';
import userSchemaCreator from '../src/infra/mongo/models/users/usersSchema';
import Sequelize from '../src/infra/sql';
import sqlUsersModel from '../src/infra/sql/models/users/usersSchema';
import usersData from './testData/users.json';

// Connect to mongoose
mongoose.connect(
  `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:
    ${process.env.DB_PORT}/${process.env.DB_NAME}-${process.env.NODE_ENV}`, {useNewUrlParser: true})
  .catch((e: any) => {
    throw e;
  });

// Connect to SqLite
const sequelize = Sequelize();
sqlUsersModel(sequelize);

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

export async function seedDatabase() {
  // Mongo
  await userModel.insertMany(usersData);

  // SqLite migrations and seedings
  await umzug.up();
  await sequelize.models.User.bulkCreate(usersData);
}

export async function cleanDatabase() {
  await userModel.remove({});
  await umzug.down();
}
