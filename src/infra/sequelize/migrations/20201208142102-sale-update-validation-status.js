'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE sales S
      INNER JOIN vehicles V ON V.id = S.vehicleId
      SET S.validationStatus = if(V.statusId = 4, 'DRAFT', if(V.statusId = 1, 'CANCELED', 'VALIDATED'))
    `);
  },

  down: async (queryInterface, Sequelize) => {},
};
