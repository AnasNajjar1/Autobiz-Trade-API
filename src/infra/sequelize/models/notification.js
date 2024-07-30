module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'notification',
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      data: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      referenceTable: {
        type: DataTypes.STRING(255),
      },
      referenceId: {
        type: DataTypes.BIGINT.UNSIGNED,
      },
      viaMail: {
        type: DataTypes.BOOLEAN,
      },
      viaApp: {
        type: DataTypes.BOOLEAN,
      },
      mailSentAt: {
        type: DataTypes.DATE,
      },
      mailSentError: {
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: 'notifications',
    },
  );
  Notification.associate = function (models) {
    Notification.belongsTo(models.user);
  };

  return Notification;
};
