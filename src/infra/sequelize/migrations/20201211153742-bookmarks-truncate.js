'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`TRUNCATE TABLE bookmarks`);
  },

  down: async (queryInterface, Sequelize) => {},
};
