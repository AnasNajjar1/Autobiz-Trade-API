'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('vehicles', 'userManual', {
        type: Sequelize.STRING(6),
        allowNull: true,
      }),
      queryInterface.changeColumn('vehicles', 'secondSetKey', {
        type: Sequelize.STRING(6),
        allowNull: true,
      }),
      queryInterface.sequelize.query(`
      UPDATE vehicles
      SET userManual = (
        CASE
          WHEN userManual = '0' THEN 'false'
          WHEN userManual = '1' THEN 'true'
          ELSE userManual
        END
      ),secondSetKey = (
        CASE
          WHEN secondSetKey = '0' THEN 'false'
          WHEN secondSetKey = '1' THEN 'true'
          ELSE secondSetKey
        END
      )
      `),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('vehicles', 'userManual', {
        type: Sequelize.TINYINT(4),
        allowNull: true,
      }),
      queryInterface.changeColumn('vehicles', 'secondSetKey', {
        type: Sequelize.TINYINT(4),
        allowNull: true,
      }),
      queryInterface.sequelize.query(`
      UPDATE vehicles
      SET userManual = (
        CASE
          WHEN userManual = 'false' THEN 0
          WHEN userManual = 'true' THEN 1
          ELSE userManual
        END
      ),secondSetKey = (
        CASE
          WHEN secondSetKey = 'false' THEN 0
          WHEN secondSetKey = 'true' THEN 1
          ELSE secondSetKey
        END
      )
      `),
    ]);
  },
};
