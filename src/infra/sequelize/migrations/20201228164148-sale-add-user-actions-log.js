'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales', 'createdBy', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'createdAt',
    });

    await queryInterface.addColumn('sales', 'updatedBy', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'updatedAt',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales', 'createdBy');
    await queryInterface.removeColumn('sales', 'updatedBy');
  },
};
