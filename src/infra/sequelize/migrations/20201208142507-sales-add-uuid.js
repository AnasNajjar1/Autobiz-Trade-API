'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      after: 'id',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales', 'uuid');
  },
};
