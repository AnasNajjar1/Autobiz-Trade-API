'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales', 'expressSale', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: 'listId',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales', 'expressSale');
  },
};
