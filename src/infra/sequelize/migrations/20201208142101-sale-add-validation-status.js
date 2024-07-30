'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales', 'validationStatus', {
      type: Sequelize.ENUM('DRAFT', 'VALIDATED', 'CANCELED'),
      allowNull: false,
      defaultValue: 'DRAFT',
      after: 'id',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales', 'validationStatus');
  },
};
