'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE TRIGGER afterDeleteOffer
      AFTER DELETE
      ON saleOffers FOR EACH ROW
      BEGIN
        CALL calcSales(OLD.saleId);
      END
      `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TRIGGER afterDeleteOffer`);
  },
};
