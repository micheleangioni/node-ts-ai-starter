import express from 'express';
import Sequelize from 'sequelize';

export default function (app: express.Application) {
  const sequelize = app.get('sqlClient');

  // The following tweak allows for seeding in testing directly using Sequelize to handle DB operations
  try {
    sequelize.define('User', {
      email: { type: Sequelize.STRING, allowNull: false },
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      password: { type: Sequelize.STRING, allowNull: false },
      username: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    }, {
      indexes: [{
        fields: ['email'],
        unique: true,
      }],
    });
  } catch (error) {
    // sequelize.models.User
  }

  return sequelize.models.User;
}
