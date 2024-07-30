'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'deletedBy', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'deletedAt',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'deletedBy');
  },
};
