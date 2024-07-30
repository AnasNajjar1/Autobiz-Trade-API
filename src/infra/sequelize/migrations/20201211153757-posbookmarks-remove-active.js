'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('pointOfSalesBookmarks', 'active');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('pointOfSalesBookmarks', 'active', {
      type: Sequelize.TINYINT(4),
      defaultValue: null,
    });
  },
};
