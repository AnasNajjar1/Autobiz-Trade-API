module.exports = (sequelize, DataTypes) => {
  const GroupOwner = sequelize.define(
    'groupowner',
    {
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { tableName: 'groupOwners', timestamps: false },
  );

  return GroupOwner;
};
