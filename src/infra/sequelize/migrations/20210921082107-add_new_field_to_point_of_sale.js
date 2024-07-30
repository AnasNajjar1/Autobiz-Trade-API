'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('pointOfSales', 'paymentDeadlineInt', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'paymentDeadline',
    });

    await queryInterface.addColumn('pointOfSales', 'pickupDeadlineInt', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'pickupDeadline',
    });
    await queryInterface.addColumn('pointOfSales', 'commentsInt', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'comments',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('pointOfSales', 'paymentDeadlineInt');
    await queryInterface.removeColumn('pointOfSales', 'pickupDeadlineInt');
    await queryInterface.removeColumn('pointOfSales', 'commentsInt');
  },
};
