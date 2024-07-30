'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('partnerRequests', 'createdBy', {
      type: Sequelize.STRING(30),
      allowNull: true,
      defaultValue: null,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('partnerRequests', 'createdBy');
  },
};