'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales', 'assignedWinner', {
      type: Sequelize.STRING(50),
      after: 'commentInt',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales', 'assignedWinner');
  },
};
