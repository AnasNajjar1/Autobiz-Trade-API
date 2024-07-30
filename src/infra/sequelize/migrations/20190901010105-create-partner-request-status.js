'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('partnerRequestStatuses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10).UNSIGNED,
      },
      name: {
        type: Sequelize.STRING(50),
        defaultValue: null,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('partnerRequestStatuses');
  },
};
