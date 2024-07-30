'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'thumbnail', {
      type: Sequelize.STRING(256),
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'thumbnail');
  },
};
