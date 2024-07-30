'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
        UPDATE sales S
        INNER JOIN vehicles V ON V.id = S.vehicleId
        SET S.supplyType = if(V.offerType = 'offerToPrivate', 'OFFER_TO_PRIVATE', 'STOCK')
      `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE vehicles V
      INNER JOIN sales S ON V.id = S.vehicleId
      SET V.offerType = if(S.supplyType = 'OFFER_TO_PRIVATE', 'offerToPrivate', 'stock')
    `);
  },
};
