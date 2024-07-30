'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE OR REPLACE VIEW `partnerLastOffer` AS select `p`.`value` AS `value`, `p`.`comment` AS `comment`, `p`.`createdAt` AS `createdAt`, `p`.`partnerRequestId` AS `partnerRequestId` from (`partnerOffers` `p` join (select max(`p2`.`createdAt`) AS `Max(createdAt)`, `p2`.`partnerRequestId` AS `partnerRequestId` from `partnerOffers` `p2` group by `p2`.`partnerRequestId`) `lo` on (`p`.`partnerRequestId` = `lo`.`partnerRequestId` and `p`.`createdAt` = `lo`.`Max(createdAt)`))',
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP VIEW partnerLastOffer`);
  },
};
