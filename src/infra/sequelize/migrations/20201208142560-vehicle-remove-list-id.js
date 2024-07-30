'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.sequelize.query(`
    //   ALTER TABLE vehicles
    //   DROP FOREIGN KEY vehicles_listId_foreign_idx;
    // `);

    await queryInterface.removeColumn('vehicles', 'listId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vehicles', 'listId', {
      type: Sequelize.INTEGER,
      after: 'groupId',
    });

    // await queryInterface.sequelize.query(`
    //   ALTER TABLE vehicles
    //   ADD CONSTRAINT vehicles_listId_foreign_idx
    //   FOREIGN KEY (listId) REFERENCES lists(id) ON DELETE SET NULL ON UPDATE RESTRICT;
    // `);
  },
};
