'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('pointOfSales', {
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
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        picture: {
          type: Sequelize.STRING(2083),
          defaultValue: null,
        },
        info: {
          type: Sequelize.TEXT,
          defaultValue: null,
        },
        documentation: {
          type: Sequelize.TEXT,
          defaultValue: null,
        },
        zipCode: {
          type: Sequelize.STRING(20),
          defaultValue: null,
        },
        city: {
          type: Sequelize.STRING(255),
          defaultValue: null,
        },
        country: {
          type: Sequelize.STRING(10),
          defaultValue: null,
        },
        latitude: {
          type: Sequelize.DECIMAL(9, 6),
          defaultValue: null,
        },
        longitude: {
          type: Sequelize.DECIMAL(9, 6),
          defaultValue: null,
        },
        autobizPosId: {
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
        queryInterface.addIndex('pointOfSales', ['uuid']);
      });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('pointOfSales');
  },
};
