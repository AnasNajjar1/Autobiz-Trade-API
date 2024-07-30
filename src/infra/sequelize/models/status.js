'use strict';
module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define(
    'status',
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
    { tableName: 'statuses', timestamps: false, freezeTableName: true },
  );

  return Status;
};
