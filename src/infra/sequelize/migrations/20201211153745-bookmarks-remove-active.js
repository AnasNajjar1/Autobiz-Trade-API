'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bookmarks', 'active');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bookmarks', 'active', {
      type: Sequelize.TINYINT(4),
      defaultValue: null,
    });
  },
};
