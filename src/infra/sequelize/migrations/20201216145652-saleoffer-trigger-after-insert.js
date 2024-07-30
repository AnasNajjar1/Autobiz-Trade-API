'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE TRIGGER afterInsertOffer
      AFTER INSERT
      ON saleOffers FOR EACH ROW
      BEGIN
        CALL calcSales(NEW.saleId);
      END
      `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TRIGGER afterInsertOffer`);
  },
};
