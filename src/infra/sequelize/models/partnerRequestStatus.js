'use strict';
module.exports = (sequelize, DataTypes) => {
  const PartnerRequestStatus = sequelize.define(
    'partnerrequeststatus',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'partnerRequestStatuses',
      timestamps: false,
    },
  );

  PartnerRequestStatus.associate = function (models) {
    PartnerRequestStatus.hasMany(models.partnerrequest, {
      foreignKey: 'statusId',
    });
  };
  return PartnerRequestStatus;
};
