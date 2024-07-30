'use strict';
module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert('pointOfSales', [
      {
        id: 1,
        uuid: 'fdd1e81b-8933-11ea-b169-0289df8aaa56',
        name: 'autobiz Marseille',
        country: 'fr',
        city: 'Marseille',
      },
      {
        id: 2,
        uuid: 'f235806d-88a1-11ea-b169-0289df8aaa56',
        autobizPosId: '137215',
        city: 'Malakoff',
        comments: '',
        country: 'fr',
        documentation:
          '[{"pdf":"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf","title":"test"},{"text":"text","title":"title","pdf":"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"}]',
        latitude: 48.819658,
        longitude: 2.303619,
        name: 'autobiz Malakoff',
        paymentDeadline: '<p>html</p>',
        pickupDeadline: '<p>html</p>',
        picture:
          'https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/pointOfSales/56/mainPicture.jpg',
        zipCode: '92240',
      },
      {
        id: 3,
        uuid: '50a43b0a-88a2-11ea-b169-0289df8aaa56',
        autobizPosId: '166523',
        city: 'Saint-Denis',
        comments: '',
        country: 'fr',
        latitude: 48.927497,
        longitude: 2.345646,
        name: 'autobiz Saint-Denis',
        paymentDeadline: '<p>html</p>',
        pickupDeadline: '<p>html</p>',
        picture:
          'https://b2b-pictures-prod.s3-eu-west-1.amazonaws.com/pointOfSales/55/mainPicture.jpg',
        zipCode: '93200',
      },
      {
        id: 4,
        uuid: '50a43b0a-88a2-11ea-b169-sdf3634sdf',
        autobizPosId: null,
        city: 'Berlin',
        country: 'de',
        latitude: null,
        longitude: null,
        name: 'autobiz Berlin',
        picture: null,
        zipCode: '10117',
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('pointOfSales', null, {});
  },
};
