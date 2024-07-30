'use strict';
module.exports = (sequelize, DataTypes) => {
  const Import = sequelize.define(
    'imports',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
      },
      status: {
        type: DataTypes.STRING,
      },
      notification: {
        type: DataTypes.TEXT,
      },
      link: {
        type: DataTypes.STRING,
      },
      importType: {
        type: DataTypes.ENUM('vehicleSale', 'vehicleImage'),
        defaultValue: 'vehicleSale',
      },
      createdBy: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: DataTypes.DATE,
    },
    { tableName: 'imports', timestamps: true },
  );

  return Import;
};
