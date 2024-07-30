'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE sales 
      SET
      sales.countOffers = (SELECT count(*) FROM saleOffers WHERE saleId = sales.id)
      `);
  },

  down: async (queryInterface, Sequelize) => {},
};
