const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define(
    'list',
    {
      uuid: {
        type: DataTypes.STRING(50),
      },
      name: {
        type: DataTypes.STRING,
      },
      picture: {
        type: DataTypes.STRING,
      },
      startDateTime: {
        type: DataTypes.DATE,
      },
      endDateTime: {
        type: DataTypes.DATE,
      },
      groupId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: 'lists',
    },
  );
  List.associate = function (models) {
    List.hasMany(models.sale);
    List.belongsTo(models.group);

    List.beforeCreate((list) => (list.uuid = uuidv4()));
  };

  return List;
};
