'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('saleOffers', 'saleType', 'offerType');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('saleOffers', 'offerType', 'saleType');
  },
};
