module.exports = (sequelize, DataTypes) => {
  const GroupMember = sequelize.define(
    'groupmember',
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
    { tableName: 'groupMembers', timestamps: false },
  );

  return GroupMember;
};
