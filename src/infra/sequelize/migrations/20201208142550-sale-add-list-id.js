'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales', 'listId', {
      type: Sequelize.INTEGER,
      onDelete: 'SET NULL',
      after: 'vehicleId',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales', 'listId');
  },
};
