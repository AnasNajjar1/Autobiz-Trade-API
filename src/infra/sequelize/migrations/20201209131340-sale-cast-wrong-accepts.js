'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE sales S
      SET S.acceptAuction = FALSE 
      where S.acceptAuction is NULL 
    `);

    await queryInterface.sequelize.query(`
      UPDATE sales S
      SET S.acceptImmediatePurchase = FALSE 
      where S.acceptImmediatePurchase is NULL 
    `);

    await queryInterface.sequelize.query(`
      UPDATE sales S
      SET S.acceptSubmission = FALSE 
      where S.acceptSubmission is NULL 
    `);
  },

  down: async (queryInterface, Sequelize) => {},
};
