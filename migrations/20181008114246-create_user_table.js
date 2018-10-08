'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    console.log('Sequelize', Sequelize, Sequelize.INTEGER)

    queryInterface.createTable('users', {
      email: { type: Sequelize.STRING, allowNull: false },
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      password: { type: Sequelize.STRING, allowNull: false },
      username: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
      updatedAt: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.STRING },
    }, {
      indexes: [{
        fields: ['email'],
        unique: true,
      }],
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user');
  }
};
