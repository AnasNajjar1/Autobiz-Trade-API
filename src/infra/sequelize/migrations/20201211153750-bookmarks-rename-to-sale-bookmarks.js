'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('bookmarks', 'salesBookmarks');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('salesBookmarks', 'bookmarks');
  },
};
