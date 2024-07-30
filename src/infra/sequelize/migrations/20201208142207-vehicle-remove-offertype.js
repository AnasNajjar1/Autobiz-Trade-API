'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'offerType');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'offerType', {
      type: Sequelize.ENUM('stock', 'offerToPrivate'),
      defaultValue: null,
      after: 'statusId',
    });
  },
};
