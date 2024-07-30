'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `DELETE FROM pointOfSalesBookmarks WHERE active = 0`,
    );
  },

  down: async (queryInterface, Sequelize) => {},
};
