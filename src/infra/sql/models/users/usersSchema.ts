import { DataTypes, Sequelize } from 'sequelize';
import User from './user';

export const attributes = {
  email: { allowNull: false, type: DataTypes.STRING },
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  password: { allowNull: false, type: DataTypes.STRING },
  username: { allowNull: true, defaultValue: null, type: DataTypes.STRING },
};

export const tableName = 'users';

export default (sequelize: Sequelize) => {
  User.init(attributes, {
    sequelize,
    tableName,
  });

  return true;
};
