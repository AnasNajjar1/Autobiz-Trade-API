'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'active');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'active', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },
};
