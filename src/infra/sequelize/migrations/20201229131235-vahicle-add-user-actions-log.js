'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'createdBy', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'createdAt',
    });
    await queryInterface.addColumn('vehicles', 'updatedBy', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'updatedAt',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'createdBy');
    await queryInterface.removeColumn('vehicles', 'updatedBy');
  },
};
