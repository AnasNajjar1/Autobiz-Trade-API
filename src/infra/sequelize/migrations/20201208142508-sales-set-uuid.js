'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
        UPDATE sales S
        SET S.uuid = UUID();
      `);
  },

  down: async (queryInterface, Sequelize) => {},
};
