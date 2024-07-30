'use strict';

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(new Date().getDate() + 1);

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('lists', [
      {
        id: 1,
        uuid: '7963a7c9-41e1-4a70-bb2b-8a56c5834ea8',
        name: 'Liste 1',
        picture: 'http://lorempixel.com/400/200/',
        startDateTime: today,
        endDateTime: tomorrow,
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        uuid: '47cfb455-8323-458a-898f-0dd685eefd0d',
        name: 'Liste 2',
        picture: 'http://lorempixel.com/400/200/',
        startDateTime: today,
        endDateTime: tomorrow,
        groupId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        uuid: '7bc4aa77-2ec2-47ae-895f-2fc4f5d459ea',
        name: 'Liste 3',
        picture: 'http://lorempixel.com/400/200/',
        startDateTime: today,
        endDateTime: tomorrow,
        groupId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('lists', null, {});
  },
};
