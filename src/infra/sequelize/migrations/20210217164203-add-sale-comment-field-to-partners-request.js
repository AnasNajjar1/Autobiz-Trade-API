'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('partnerRequests', 'saleComment', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('partnerRequests', 'saleComment');
  },
};
