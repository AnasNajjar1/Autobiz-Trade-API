'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vehicles', 'statusId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'statusId', {
      type: Sequelize.INTEGER(11).UNSIGNED,
      defaultValue: 1,
      allowNull: false,
    });
  },
};
