module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define(
    'log',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user: {
        type: DataTypes.STRING,
      },
      referenceTable: {
        type: DataTypes.STRING,
      },
      referenceId: {
        type: DataTypes.INTEGER,
      },
      data: {
        type: DataTypes.TEXT,
      },
      action: {
        type: DataTypes.ENUM('C', 'R', 'U', 'D'),
        defaultValue: null,
      },
    },
    {
      tableName: 'logs',
      timestamps: true,
    },
  );

  return Log;
};
