'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'groupId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'groupId', {
      type: Sequelize.INTEGER,
      after: 'ownerId',
    });
  },
};
