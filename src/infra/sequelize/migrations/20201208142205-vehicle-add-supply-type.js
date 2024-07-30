'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales', 'supplyType', {
      type: Sequelize.ENUM('STOCK', 'OFFER_TO_PRIVATE'),
      allowNull: false,
      after: 'validationStatus',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales', 'supplyType');
  },
};
