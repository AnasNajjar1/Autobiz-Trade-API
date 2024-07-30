'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('partnerOffers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10).UNSIGNED,
      },
      value: {
        type: Sequelize.INTEGER(11),
        defaultValue: null,
      },
      comment: {
        type: Sequelize.TEXT,
        defaultValue: null,
      },
      partnerRequestId: {
        type: Sequelize.INTEGER(10).UNSIGNED,
        defaultValue: null,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
      },
      updatedAt: Sequelize.DATE,
      ipSource: {
        type: Sequelize.STRING(50),
        defaultValue: null,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('partnerOffers');
  },
};
