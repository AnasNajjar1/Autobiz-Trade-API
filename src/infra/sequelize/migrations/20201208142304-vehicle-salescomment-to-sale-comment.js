'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
        UPDATE sales S
        INNER JOIN vehicles V ON V.id = S.vehicleId
        SET S.comment = V.salesComment
      `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      UPDATE vehicles V
      INNER JOIN sales S ON V.id = S.vehicleId
      SET V.salesComment = S.comment
    `);
  },
};
