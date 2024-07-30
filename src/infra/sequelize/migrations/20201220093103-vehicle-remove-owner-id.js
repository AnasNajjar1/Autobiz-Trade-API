'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'ownerId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'ownerId', {
      type: Sequelize.INTEGER,
      after: 'salesSpeedName',
    });
  },
};
