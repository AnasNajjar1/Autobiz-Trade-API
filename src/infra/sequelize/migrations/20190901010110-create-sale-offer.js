'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('saleOffers', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER(11).UNSIGNED,
        },
        amount: {
          type: Sequelize.INTEGER(11).UNSIGNED,
          allowNull: false,
          defaultValue: 0,
        },
        saleType: {
          type: Sequelize.ENUM(['auction', 'submission', 'immediatePurchase']),
          allowNull: false,
        },

        userId: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        saleId: {
          type: Sequelize.INTEGER(10).UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: 'sales',
            key: 'id',
          },
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('now'),
          allowNull: false,
        },
        updatedAt: Sequelize.DATE,
      })
      .then(() => {
        queryInterface.addIndex('saleOffers', ['saleType']),
          queryInterface.addIndex('saleOffers', ['userId']);
      });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('saleOffers');
  },
};
