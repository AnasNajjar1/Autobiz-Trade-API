'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'salesComment');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'salesComment', {
      type: Sequelize.TEXT,
    });
  },
};
