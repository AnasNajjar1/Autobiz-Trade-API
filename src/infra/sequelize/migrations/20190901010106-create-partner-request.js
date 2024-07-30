'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('partnerRequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11).UNSIGNED,
      },
      vehicleId: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        defaultValue: null,
      },
      partnerId: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        defaultValue: null,
      },
      uuid: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
      },
      updatedAt: Sequelize.DATE,
      statusId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        defaultValue: null,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('partnerRequests');
  },
};
