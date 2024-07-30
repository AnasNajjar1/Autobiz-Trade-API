'use strict';
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.dropTable('statuses');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('statuses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11).UNSIGNED,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    });

    await queryInterface.bulkInsert('statuses', [
      {
        id: 1,
        name: 'offline',
      },
      {
        id: 2,
        name: 'online',
      },
      {
        id: 3,
        name: 'sold',
      },
      {
        id: 4,
        name: 'pending',
      },
    ]);
  },
};
