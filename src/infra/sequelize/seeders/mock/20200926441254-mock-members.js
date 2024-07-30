'use strict';
module.exports = {
  up: async (queryInterface) => {
    //Groups
    await queryInterface.bulkInsert('groups', [
      {
        id: 1,
        name: 'Easy Reprise',
      },
      {
        id: 2,
        name: 'Reprise Facile',
      },
      {
        id: 3,
        name: 'AT crew',
      },
      {
        id: 34,
        name: 'Public',
      },
    ]);

    // Users
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        autobizUserId: 'FR_1630593', // Marceau FR
        notificationDaily: true,
        notificationNewPush: false,
        notificationAuction: true,
      },
      {
        id: 2,
        autobizUserId: 'FR_1633811', // Benoit FR
        notificationDaily: false,
        notificationNewPush: true,
        notificationAuction: false,
      },
      {
        id: 3,
        autobizUserId: 'ES_1634372', // Benoit ES
        notificationDaily: true,
        notificationNewPush: true,
        notificationAuction: false,
      },
    ]);

    // Group Members
    // Group 3 : AT crew (Marceau FR, Benoit FR, Benoit ES)
    await queryInterface.bulkInsert('groupMembers', [
      {
        id: 1,
        groupId: 3,
        userId: 1,
      },
      {
        id: 2,
        groupId: 3,
        userId: 2,
      },
      {
        id: 3,
        groupId: 3,
        userId: 3,
      },
    ]);

    // Group Owners
    // Group 3 : AT crew (Marceau FR)
    await queryInterface.bulkInsert('groupOwners', [
      {
        id: 1,
        groupId: 3,
        userId: 1,
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('groupOwners', null, {});
    await queryInterface.bulkDelete('groupMembers', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('groups', null, {});
  },
};
