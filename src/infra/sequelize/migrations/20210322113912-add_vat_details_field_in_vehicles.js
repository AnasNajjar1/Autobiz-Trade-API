'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'vatDetails', {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: null,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'vatDetails');
  },
};
