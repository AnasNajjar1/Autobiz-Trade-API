'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('vehicles', 'listId', {
      type: Sequelize.INTEGER,
      onDelete: 'SET NULL',
      references: {
        model: 'lists',
        key: 'id',
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('vehicles', 'listId');
  },
};
