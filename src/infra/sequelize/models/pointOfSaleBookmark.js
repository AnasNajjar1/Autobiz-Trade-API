'use strict';
module.exports = (sequelize, DataTypes) => {
  const PointofSalesBookmark = sequelize.define(
    'pointofsalebookmark',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: null,
      },
      pointOfSaleId: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
    },
    { tableName: 'pointOfSalesBookmarks' },
  );

  PointofSalesBookmark.associate = function (models) {
    PointofSalesBookmark.belongsTo(models.pointofsale);
  };

  return PointofSalesBookmark;
};
