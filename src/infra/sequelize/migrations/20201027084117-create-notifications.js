'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
          as: 'userId',
        },
      },
      type: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      data: {
        type: Sequelize.TEXT,
      },
      referenceTable: {
        type: Sequelize.STRING(255),
      },
      referenceId: {
        type: Sequelize.BIGINT.UNSIGNED,
      },
      viaMail: {
        type: Sequelize.BOOLEAN,
      },
      viaApp: {
        type: Sequelize.BOOLEAN,
      },
      mailSentAt: {
        type: Sequelize.DATE,
      },
      mailSentError: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notifications');
  },
};
