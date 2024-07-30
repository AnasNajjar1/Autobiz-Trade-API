'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales', 'countOffers', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'updatedAt',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales', 'countOffers');
  },
};
