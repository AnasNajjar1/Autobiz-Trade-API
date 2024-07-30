'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('vehicles', 'color', {
      type: Sequelize.STRING(60),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('vehicles', 'color', {
      type: Sequelize.STRING(10),
      allowNull: true,
    });
  },
};
