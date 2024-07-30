'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'vehicles',
      'reconditioningCostsMerchant',
      Sequelize.INTEGER,
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'vehicles',
      'reconditioningCostsMerchant',
    );
  },
};
