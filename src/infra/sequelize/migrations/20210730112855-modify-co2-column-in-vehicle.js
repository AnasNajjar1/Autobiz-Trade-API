'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `update vehicles set co2 = NULL where co2 = ''`,
    );
    await queryInterface.changeColumn('vehicles', 'co2', {
      type: Sequelize.INTEGER,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('vehicles', 'co2', {
      type: Sequelize.STRING(50),
      defaultValue: null,
    });
  },
};
