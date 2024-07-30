'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE sales S
      INNER JOIN vehicles V ON V.id = S.vehicleId 
      SET S.listId = V.listId
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE vehicles V
      INNER JOIN sales S ON V.id = S.vehicleId
      SET V.listId = S.listId
    `);
  },
};
