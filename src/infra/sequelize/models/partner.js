module.exports = (sequelize, DataTypes) => {
  const Partner = sequelize.define(
    'partner',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null,
      },
    },
    { tableName: 'partners', timestamps: false },
  );

  Partner.associate = function (models) {
    Partner.hasMany(models.partnerrequest, {
      foreignKey: 'partnerId',
    });
  };

  return Partner;
};
