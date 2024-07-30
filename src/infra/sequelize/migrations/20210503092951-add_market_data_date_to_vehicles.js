'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'marketDataDate', {
      type: Sequelize.DATEONLY,
      defaultValue: null,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'marketDataDate');
  },
};
