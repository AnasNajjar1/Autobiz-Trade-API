'use strict';
module.exports = (sequelize, DataTypes) => {
  const PartnerRequest = sequelize.define(
    'partnerrequest',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      vehicleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      partnerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      statusId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      saleComment: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      createdBy: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'partnerRequests',
      timestamps: true,
    },
  );

  PartnerRequest.associate = function (models) {
    PartnerRequest.belongsTo(models.partnerrequeststatus, {
      foreignKey: 'statusId',
    });
    PartnerRequest.belongsTo(models.partner, {
      foreignKey: 'partnerId',
    });
    PartnerRequest.hasOne(models.partnerlastoffer, {
      foreignKey: 'partnerRequestId',
    });
    PartnerRequest.belongsTo(models.vehicle, {
      foreignKey: 'vehicleId',
    });
    // PartnerRequest.hasMany(models.partnerlastoffer, {
    //   foreignKey: 'partnerRequestId',
    // });
  };

  return PartnerRequest;
};
