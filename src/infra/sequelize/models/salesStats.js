'use strict';
const { Op, fn, literal } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const SalesStats = sequelize.define(
    'salesStats',
    {
      saleId: {
        type: DataTypes.INTEGER,
      },
      secondsBeforeEnd: {
        type: DataTypes.BIGINT,
      },
      secondsBeforeStart: {
        type: DataTypes.BIGINT,
      },
      status: {
        type: DataTypes.STRING,
      },
    },
    { tableName: 'salesStats', timestamps: false },
  );
  SalesStats.removeAttribute('id');
  return SalesStats;
};
