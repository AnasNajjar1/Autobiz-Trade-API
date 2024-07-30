'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE vehicles
      DROP FOREIGN KEY FK_vehicles_statuses;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE vehicles
      ADD CONSTRAINT FK_vehicles_statuses
      FOREIGN KEY (statusId) REFERENCES statuses(id) ON DELETE RESTRICT ON UPDATE CASCADE;
    `);
  },
};
