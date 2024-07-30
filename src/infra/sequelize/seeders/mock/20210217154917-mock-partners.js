'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //Partners
    await queryInterface.bulkInsert('partners', [
      {
        id: 1,
        name: 'vpauto',
      },
      {
        id: 2,
        name: 'encheresvo',
      },
    ]);
    // Partner request status
    await queryInterface.bulkInsert('partnerRequestStatuses', [
      {
        id: 1,
        name: 'submited',
      },
      {
        id: 2,
        name: 'failed',
      },
      {
        id: 3,
        name: 'received',
      },
      {
        id: 4,
        name: 'declined',
      },
      {
        id: 5,
        name: 'submiting',
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('partners', null, {});
  },
};
