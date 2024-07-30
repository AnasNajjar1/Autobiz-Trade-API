'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bookmarks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11).UNSIGNED,
      },
      userId: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      vehicleId: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
      },
      active: {
        type: Sequelize.TINYINT(4),
        defaultValue: null,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
      },
      updatedAt: Sequelize.DATE,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('bookmarks');
  },
};
