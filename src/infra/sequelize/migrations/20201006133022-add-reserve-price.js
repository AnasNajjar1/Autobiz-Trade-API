'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('sales', 'auctionReservePrice', {
      type: Sequelize.INTEGER(11).UNSIGNED,
      allowNull: true,
      defaultValue: null,
      after: 'auctionStepPrice',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('sales', 'auctionReservePrice');
  },
};
