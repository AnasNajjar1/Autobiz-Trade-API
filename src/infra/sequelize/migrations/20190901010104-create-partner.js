'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('partners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10).UNSIGNED,
      },
      name: {
        type: Sequelize.STRING(100),
        defaultValue: null,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('partners');
  },
};
