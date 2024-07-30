'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('bookmarks', 'vehicleId', 'saleId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('bookmarks', 'saleId', 'vehicleId');
  },
};
