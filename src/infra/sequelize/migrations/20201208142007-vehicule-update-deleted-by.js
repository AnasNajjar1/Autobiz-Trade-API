'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE vehicles
      SET deletedAt = NOW()
      WHERE active = 0
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    UPDATE vehicles
    SET active = 0
    WHERE deletedAt IS NOT NULL
  `);
  },
};
