module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      autobizUserId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notificationDaily: {
        type: DataTypes.BOOLEAN,
      },
      notificationNewPush: {
        type: DataTypes.BOOLEAN,
      },
      notificationAuction: {
        type: DataTypes.BOOLEAN,
      },
    },
    { tableName: 'users', timestamps: false },
  );

  User.associate = function (models) {
    User.belongsToMany(models.group, {
      through: models.groupmember,
      foreignKey: 'userId',
      as: 'inGroups',
    });

    User.belongsToMany(models.group, {
      through: models.groupowner,
      foreignKey: 'userId',
      as: 'hasGroups',
    });
  };
  return User;
};
