'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      INSERT INTO groupMembers (groupId, userId) 
      SELECT 34, id FROM users WHERE autobizUserId LIKE 'FR%'
      AND id NOT IN
      (SELECT g.userId FROM groupMembers g, users u WHERE g.groupId = 34 AND g.userId = u.id);
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DELETE FROM groupMembers 
      WHERE groupId = 34 
      AND userId IN 
      (SELECT id FROM users WHERE autobizUserId LIKE 'FR%');
    `);
  },
};
