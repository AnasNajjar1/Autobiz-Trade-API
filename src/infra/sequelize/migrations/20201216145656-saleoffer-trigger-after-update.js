'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE TRIGGER afterUpdateOffer
      AFTER UPDATE 
      ON saleOffers FOR EACH ROW
      BEGIN
        CALL calcSales(OLD.saleId);
        CALL calcSales(NEW.saleId);
      END
      `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP TRIGGER afterUpdateOffer`);
  },
};
