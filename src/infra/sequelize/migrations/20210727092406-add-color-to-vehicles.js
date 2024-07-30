'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'color', Sequelize.STRING(10));
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'color');
  }
};
