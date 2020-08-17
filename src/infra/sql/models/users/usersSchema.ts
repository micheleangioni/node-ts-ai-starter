import { DataTypes, Sequelize } from 'sequelize';
import User from './user';

export const attributes = {
  email: { type: DataTypes.STRING, allowNull: false },
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  password: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
};

export const tableName = 'users';

export default (sequelize: Sequelize) => {
  User.init(attributes, {
    sequelize,
    tableName,
  });

  return true;
};
