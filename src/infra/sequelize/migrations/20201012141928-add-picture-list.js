'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('lists', 'picture', {
      type: Sequelize.STRING(2083),
      allowNull: true,
      defaultValue: null,
      after: 'name',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('lists', 'picture');
  },
};
