module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    'group',
    {
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'groups',
      timestamps: false,
    },
  );

  Group.associate = function (models) {
    Group.belongsToMany(models.user, {
      through: models.groupmember,
      foreignKey: 'groupId',
      as: 'members',
    });

    Group.belongsToMany(models.user, {
      through: models.groupowner,
      foreignKey: 'groupId',
      as: 'owners',
    });
  };
  return Group;
};
