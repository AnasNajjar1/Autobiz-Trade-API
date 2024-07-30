'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'entryStockDate', {
      type: Sequelize.DATEONLY,
      defaultValue: null,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'entryStockDate');
  },
};
