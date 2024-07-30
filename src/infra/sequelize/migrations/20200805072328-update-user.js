'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'notificationDaily', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn('users', 'notificationNewPush', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn('users', 'notificationAuction', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'notificationDaily');
    await queryInterface.removeColumn('users', 'notificationNewPush');
    await queryInterface.removeColumn('users', 'notificationAuction');
  },
};
