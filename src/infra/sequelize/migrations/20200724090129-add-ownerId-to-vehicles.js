'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'ownerId', Sequelize.INTEGER);
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('vehicles', 'ownerId');
  },
};
