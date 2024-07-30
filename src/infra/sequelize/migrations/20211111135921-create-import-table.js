'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('imports', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER(11).UNSIGNED,
        },
        uuid: {
          allowNull: false,
          type: Sequelize.UUID,
        },
        status: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        notification: {
          type: Sequelize.TEXT,
          defaultValue: null,
        },
        link: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        importType: {
          type: Sequelize.ENUM(['vehicleSale', 'vehicleImage']),
          defaultValue: 'vehicleSale',
          allowNull: false,
        },
        createdBy: {
          type: Sequelize.STRING(20),
          defaultValue: null,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('now'),
          allowNull: false,
        },
        updatedAt: Sequelize.DATE,
      })
      .then(() => {
        queryInterface.addIndex('imports', ['uuid']);
        queryInterface.addIndex('imports', ['id']);
        queryInterface.addIndex('imports', ['status']);
        queryInterface.addIndex('imports', ['importType']);
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('imports');
  },
};
