import { DataTypes } from 'sequelize';
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

export default function (sequelize: any) {
  User.init(attributes, {
    sequelize,
    tableName,
  });

  return true;
}
