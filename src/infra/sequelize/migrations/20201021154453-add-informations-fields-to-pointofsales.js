'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('pointOfSales', 'paymentDeadline', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'info',
    });

    await queryInterface.addColumn('pointOfSales', 'pickupDeadline', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'paymentDeadline',
    });
    await queryInterface.addColumn('pointOfSales', 'comments', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'pickupDeadline',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('pointOfSales', 'paymentDeadline');
    await queryInterface.removeColumn('pointOfSales', 'pickupDeadline');
    await queryInterface.removeColumn('pointOfSales', 'comments');
  },
};
