'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11).UNSIGNED,
      },
      acceptAuction: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
      acceptImmediatePurchase: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
      acceptSubmission: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
      auctionStartPrice: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      auctionStepPrice: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      immediatePurchasePrice: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      startDateTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
      },
      endDateTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
      },
      vehicleId: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'vehicles',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
      },
      updatedAt: Sequelize.DATE,
      countAuctions: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        defaultValue: 0,
      },
      minimalAuction: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        defaultValue: 0,
      },
      bestAuction: {
        type: Sequelize.INTEGER(11),
      },
      bestOfferType: {
        type: Sequelize.STRING(50),
      },
      winner: {
        type: Sequelize.STRING(50),
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('sales');
  },
};
