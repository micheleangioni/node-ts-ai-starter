import usersModel from './users/users';
import {Mongoose} from 'mongoose';

export default (mongooseClient: Mongoose) => {
  const userModel = usersModel(mongooseClient);

  return {
    userModel,
  };
};
