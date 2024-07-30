'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('sales', 'bestOfferer', {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: null,
      after: 'bestOfferType',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('sales', 'bestOfferer');
  },
};
