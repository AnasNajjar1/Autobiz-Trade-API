module.exports = (sequelize, DataTypes) => {
  const Partner = sequelize.define(
    'partneroffer',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      partnerRequestId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      ipSource: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
      },
    },
    { tableName: 'partnerOffers' },
  );

  return Partner;
};
