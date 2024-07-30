'use strict';
module.exports = (sequelize, DataTypes) => {
  const PointOfSale = sequelize.define(
    'pointofsale',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
      },
      name: {
        type: DataTypes.STRING,
      },
      picture: {
        type: DataTypes.STRING,
      },
      info: {
        type: DataTypes.TEXT,
      },
      documentation: {
        type: DataTypes.TEXT,
      },
      paymentDeadline: {
        type: DataTypes.TEXT,
      },
      pickupDeadline: {
        type: DataTypes.TEXT,
      },
      comments: {
        type: DataTypes.TEXT,
      },
      zipCode: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      latitude: {
        type: DataTypes.DECIMAL,
      },
      longitude: {
        type: DataTypes.DECIMAL,
      },
      autobizPosId: {
        type: DataTypes.STRING,
      },
      company: {
        type: DataTypes.STRING(80),
        allowNull: true,
        defaultValue: null,
      },
      paymentDeadlineInt: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      pickupDeadlineInt: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      commentsInt: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
    },
    { tableName: 'pointOfSales' },
  );

  PointOfSale.associate = function (models) {
    PointOfSale.hasMany(models.vehicle, {
      foreignKey: 'pointOfSaleId',
    });
    PointOfSale.hasMany(models.pointofsalebookmark);
  };
  return PointOfSale;
};
