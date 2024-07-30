'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      referenceTable: {
        type: Sequelize.STRING,
      },
      referenceId: {
        type: Sequelize.INTEGER,
      },
      data: {
        type: Sequelize.TEXT,
      },
      user: {
        type: Sequelize.STRING,
      },
      action: {
        type: Sequelize.ENUM('C', 'R', 'U', 'D'),
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('logs');
  },
};
