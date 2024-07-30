'use strict';
module.exports = (sequelize, DataTypes) => {
  const PartnerLastOffer = sequelize.define(
    'partnerlastoffer',
    {
      value: {
        type: DataTypes.INTEGER,
      },
      comment: {
        type: DataTypes.TEXT,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      partnerRequestId: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
    },
    {
      tableName: 'partnerLastOffer',
      timestamps: false,
    },
  );

  PartnerLastOffer.associate = function (models) {
    PartnerLastOffer.belongsTo(models.partnerrequest, {
      foreignKey: 'partnerRequestId',
    });
  };
  PartnerLastOffer.removeAttribute('id');
  return PartnerLastOffer;
};
