'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales', 'ownerId', {
      type: Sequelize.INTEGER,
      after: 'vehicleId',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales', 'ownerId');
  },
};
