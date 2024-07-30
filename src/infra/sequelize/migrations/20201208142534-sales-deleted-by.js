'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales', 'deletedBy', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'deletedAt',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales', 'deletedBy');
  },
};
