'use strict';
const { Op, fn, literal } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define(
    'sale',
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      validationStatus: {
        type: DataTypes.ENUM('DRAFT', 'VALIDATED', 'CANCELED'),
        allowNull: false,
        defaultValue: 'DRAFT',
      },
      supplyType: {
        type: DataTypes.ENUM('STOCK', 'OFFER_TO_PRIVATE'),
        allowNull: false,
      },
      acceptAuction: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      acceptImmediatePurchase: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      acceptSubmission: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      auctionStartPrice: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: false,
      },
      auctionStepPrice: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: false,
      },
      auctionReservePrice: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      immediatePurchasePrice: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: false,
      },
      startDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      commentInt: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      vehicleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: false,
      },
      ownerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: null,
      },
      listId: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
      carcheckId: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
      expressSale: {
        type: DataTypes.BOOLEAN,
      },
      createdBy: {
        type: DataTypes.STRING,
      },
      updatedBy: {
        type: DataTypes.STRING,
      },
      deletedBy: {
        type: DataTypes.STRING,
      },
      groupId: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
      assignedWinner: {
        type: DataTypes.STRING(50),
      },
      countOffers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      countAuctions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      minimalAuction: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      bestAuction: {
        type: DataTypes.INTEGER,
      },
      bestOfferType: {
        type: DataTypes.STRING(50),
      },
      bestOfferer: {
        type: DataTypes.STRING(50),
      },
      winner: {
        type: DataTypes.STRING(50),
      },
      assignedWinnerOffer: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
    },
    { paranoid: true },
  );

  Sale.associate = function (models) {
    Sale.belongsTo(models.vehicle, {
      foreignKey: 'vehicleId',
    });
    Sale.belongsTo(models.user, {
      foreignKey: 'ownerId',
    });
    Sale.belongsTo(models.group, {
      foreignKey: 'groupId',
    });
    Sale.hasOne(models.salesStats);
    Sale.hasMany(models.saleoffer);
    Sale.belongsTo(models.list);

    Sale.hasMany(models.salebookmark);
  };

  return Sale;
};
