'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'groupId', Sequelize.INTEGER);
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('vehicles', 'groupId');
  },
};
