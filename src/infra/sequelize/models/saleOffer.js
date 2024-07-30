'use strict';
module.exports = (sequelize, DataTypes) => {
  const SaleOffer = sequelize.define(
    'saleoffer',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      amount: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      offerType: {
        type: DataTypes.ENUM('auction', 'submission', 'immediatePurchase'),
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      saleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    { tableName: 'saleOffers' },
  );

  SaleOffer.associate = function (models) {
    SaleOffer.belongsTo(models.sale, {
      foreignKey: 'saleId',
    });
  };

  return SaleOffer;
};
