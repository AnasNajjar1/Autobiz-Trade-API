'use strict';
module.exports = (sequelize, DataTypes) => {
  const SalesBookmark = sequelize.define(
    'salebookmark',
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
      saleId: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
    },
    { tableName: 'salesBookmarks' },
  );

  SalesBookmark.associate = function (models) {
    SalesBookmark.belongsTo(models.sale);
  };

  return SalesBookmark;
};
