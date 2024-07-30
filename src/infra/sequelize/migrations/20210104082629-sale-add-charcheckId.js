'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales', 'carcheckId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      after: 'listId',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales', 'carcheckId');
  },
};
