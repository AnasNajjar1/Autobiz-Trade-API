'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales', 'deletedAt', {
      type: Sequelize.DATE,
      defaultValue: null,
      after: 'updatedAt',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales', 'deletedAt');
  },
};
