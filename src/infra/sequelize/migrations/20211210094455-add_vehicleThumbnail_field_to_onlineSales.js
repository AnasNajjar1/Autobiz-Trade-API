'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "CREATE OR REPLACE ALGORITHM = UNDEFINED VIEW onlineSales AS (SELECT `sale`.*, (SELECT   GROUP_CONCAT(CONCAT('{\n" +
        '  "id":"\', saleoffers.id, \'",\n' +
        '  "amount":"\',saleoffers.amount,\'",\n' +
        '  "offerType":"\',saleoffers.offerType,\'",\n' +
        '  "userId":"\',saleoffers.userId,\'",\n' +
        '  "saleId":"\',saleoffers.saleId,\'",\n' +
        '  "createdAt":"\',saleoffers.createdAt,\'",\n' +
        '  "updatedAt":"\',saleoffers.updatedAt,\'"\n' +
        "  }')) list FROM   `saleOffers` AS `saleoffers`  where `sale`.`id` = `saleoffers`.`saleId`) AS saleoffers  ," +
        " (CONCAT('{\n" +
        '   "id":"\', user.id, \'",\n' +
        '  "autobizUserId":"\', user.autobizUserId, \'",\n' +
        '  "notificationDaily":"\', user.notificationDaily, \'", \n' +
        '  "notificationNewPush":"\', user.notificationNewPush, \'", \n' +
        '  "notificationAuction":"\', user.notificationAuction, \'"\n' +
        '   \n' +
        "  }')) user ," +
        " (SELECT GROUP_CONCAT(CONCAT('{\n" +
        ' "salebookmarksId":"\', salebookmarks.id, \'",\n' +
        ' "userId":"\',salebookmarks.userId,\'"\n' +
        "  }'))  list FROM `salesBookmarks` AS `salebookmarks` WHERE `sale`.`id` = `salebookmarks`.`saleId`) AS salebookmarks FROM   " +
        ' (SELECT `sale`.`id`, `sale`.`uuid`, `sale`.`validationStatus`, `sale`.`supplyType`, `sale`.`acceptAuction`, `sale`.`acceptImmediatePurchase`, `sale`.`acceptSubmission`, `sale`.`auctionStartPrice`, `sale`.`auctionStepPrice`, `sale`.`auctionReservePrice`, `sale`.`immediatePurchasePrice`, `sale`.`startDateTime`, `sale`.`endDateTime`, `sale`.`comment`, `sale`.`commentInt`, `sale`.`vehicleId`, `sale`.`ownerId`, `sale`.`listId`, `sale`.`carcheckId`, `sale`.`expressSale`, `sale`.`createdBy`, `sale`.`updatedBy`, `sale`.`deletedBy`, `sale`.`groupId`, `sale`.`assignedWinner`, `sale`.`countOffers`, `sale`.`countAuctions`, `sale`.`minimalAuction`, `sale`.`bestAuction`, `sale`.`bestOfferType`, `sale`.`bestOfferer`, `sale`.`winner`, `sale`.`createdAt`, `sale`.`updatedAt`, `sale`.`deletedAt`, `salesStat`.`saleId` AS salesStatSaleId, `salesStat`.`secondsBeforeEnd` AS salesStatSecondsBeforeEnd, `salesStat`.`secondsBeforeStart` AS salesStatSecondsBeforeStart, `salesStat`.`status` AS salesStatStatus,' +
        '  `vehicle`.`uuid` AS `vehicleUuid`, `vehicle`.`fileNumber` AS `vehicleFileNumber`, `vehicle`.`registration` AS `vehicleRegistration`, `vehicle`.`brandLabel` AS `vehicleBrandLabel`, `vehicle`.`modelLabel` AS `vehicleModelLabel`, `vehicle`.`versionLabel` AS `vehicleVersionLabel`, `vehicle`.`firstRegistrationDate` AS `vehicleFirstRegistrationDate`, `vehicle`.`fuelLabel` AS `vehicleFuelLabel`, `vehicle`.`mileage` AS `vehicleMileage`, `vehicle`.`carPictures` AS `vehicleCarPictures`, `vehicle`.`profileBodyCosts` AS `vehicleProfileBodyCosts`, `vehicle`.`pointOfSaleId` AS `vehiclePointOfSaleId`, `vehicle`.`thumbnail` AS `vehicleThumbnail`' +
        ", `vehicle->pointofsale`.`id` AS `pointOfSaleId`, `vehicle->pointofsale`.`uuid` AS `pointOfSaleUuid`, `vehicle->pointofsale`.`name` AS `pointOfSaleName`, `vehicle->pointofsale`.`city` AS `pointOfSaleCity`, `vehicle->pointofsale`.`zipCode` AS `pointOfSaleZipCode`, `vehicle->pointofsale`.`country` AS `pointOfSaleCountry` , `vehicle->pointofsale`.`latitude` AS `pointOfSaleLatitude`, `vehicle->pointofsale`.`longitude` AS `pointOfSaleLongitude` FROM `sales` AS `sale` INNER JOIN `salesStats` AS `salesStat` ON `sale`.`id` = `salesStat`.`saleId` AND `salesStat`.`status` IN ('LIVE', 'CLOSED', 'SCHEDULED') INNER JOIN `vehicles` AS `vehicle` ON `sale`.`vehicleId` = `vehicle`.`id` AND `vehicle`.`deletedAt` IS NULL INNER JOIN `pointOfSales` AS `vehicle->pointofsale` ON `vehicle`.`pointOfSaleId` = `vehicle->pointofsale`.`id`)      AS `sale`" +
        '   LEFT OUTER JOIN `saleOffers` AS `saleoffers` ON `sale`.`id` = `saleoffers`.`saleId` LEFT OUTER JOIN `users` AS `user` ON `sale`.`ownerId` = `user`.`id` LEFT OUTER JOIN `salesBookmarks` AS `salebookmarks` ON `sale`.`id` = `salebookmarks`.`saleId` group by sale.id\n)',
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "CREATE OR REPLACE ALGORITHM = UNDEFINED VIEW onlineSales AS (SELECT `sale`.*, (SELECT   GROUP_CONCAT(CONCAT('{\n" +
        '  "id":"\', saleoffers.id, \'",\n' +
        '  "amount":"\',saleoffers.amount,\'",\n' +
        '  "offerType":"\',saleoffers.offerType,\'",\n' +
        '  "userId":"\',saleoffers.userId,\'",\n' +
        '  "saleId":"\',saleoffers.saleId,\'",\n' +
        '  "createdAt":"\',saleoffers.createdAt,\'",\n' +
        '  "updatedAt":"\',saleoffers.updatedAt,\'"\n' +
        "  }')) list FROM   `saleOffers` AS `saleoffers`  where `sale`.`id` = `saleoffers`.`saleId`) AS saleoffers  ," +
        " (CONCAT('{\n" +
        '   "id":"\', user.id, \'",\n' +
        '  "autobizUserId":"\', user.autobizUserId, \'",\n' +
        '  "notificationDaily":"\', user.notificationDaily, \'", \n' +
        '  "notificationNewPush":"\', user.notificationNewPush, \'", \n' +
        '  "notificationAuction":"\', user.notificationAuction, \'"\n' +
        '   \n' +
        "  }')) user ," +
        " (SELECT GROUP_CONCAT(CONCAT('{\n" +
        ' "salebookmarksId":"\', salebookmarks.id, \'",\n' +
        ' "userId":"\',salebookmarks.userId,\'"\n' +
        "  }'))  list FROM `salesBookmarks` AS `salebookmarks` WHERE `sale`.`id` = `salebookmarks`.`saleId`) AS salebookmarks FROM   " +
        ' (SELECT `sale`.`id`, `sale`.`uuid`, `sale`.`validationStatus`, `sale`.`supplyType`, `sale`.`acceptAuction`, `sale`.`acceptImmediatePurchase`, `sale`.`acceptSubmission`, `sale`.`auctionStartPrice`, `sale`.`auctionStepPrice`, `sale`.`auctionReservePrice`, `sale`.`immediatePurchasePrice`, `sale`.`startDateTime`, `sale`.`endDateTime`, `sale`.`comment`, `sale`.`commentInt`, `sale`.`vehicleId`, `sale`.`ownerId`, `sale`.`listId`, `sale`.`carcheckId`, `sale`.`expressSale`, `sale`.`createdBy`, `sale`.`updatedBy`, `sale`.`deletedBy`, `sale`.`groupId`, `sale`.`assignedWinner`, `sale`.`countOffers`, `sale`.`countAuctions`, `sale`.`minimalAuction`, `sale`.`bestAuction`, `sale`.`bestOfferType`, `sale`.`bestOfferer`, `sale`.`winner`, `sale`.`createdAt`, `sale`.`updatedAt`, `sale`.`deletedAt`, `salesStat`.`saleId` AS salesStatSaleId, `salesStat`.`secondsBeforeEnd` AS salesStatSecondsBeforeEnd, `salesStat`.`secondsBeforeStart` AS salesStatSecondsBeforeStart, `salesStat`.`status` AS salesStatStatus,' +
        '  `vehicle`.`uuid` AS `vehicleUuid`, `vehicle`.`fileNumber` AS `vehicleFileNumber`, `vehicle`.`registration` AS `vehicleRegistration`, `vehicle`.`brandLabel` AS `vehicleBrandLabel`, `vehicle`.`modelLabel` AS `vehicleModelLabel`, `vehicle`.`versionLabel` AS `vehicleVersionLabel`, `vehicle`.`firstRegistrationDate` AS `vehicleFirstRegistrationDate`, `vehicle`.`fuelLabel` AS `vehicleFuelLabel`, `vehicle`.`mileage` AS `vehicleMileage`, `vehicle`.`carPictures` AS `vehicleCarPictures`, `vehicle`.`profileBodyCosts` AS `vehicleProfileBodyCosts`, `vehicle`.`pointOfSaleId` AS `vehiclePointOfSaleId`' +
        ", `vehicle->pointofsale`.`id` AS `pointOfSaleId`, `vehicle->pointofsale`.`uuid` AS `pointOfSaleUuid`, `vehicle->pointofsale`.`name` AS `pointOfSaleName`, `vehicle->pointofsale`.`city` AS `pointOfSaleCity`, `vehicle->pointofsale`.`zipCode` AS `pointOfSaleZipCode`, `vehicle->pointofsale`.`country` AS `pointOfSaleCountry` , `vehicle->pointofsale`.`latitude` AS `pointOfSaleLatitude`, `vehicle->pointofsale`.`longitude` AS `pointOfSaleLongitude` FROM `sales` AS `sale` INNER JOIN `salesStats` AS `salesStat` ON `sale`.`id` = `salesStat`.`saleId` AND `salesStat`.`status` IN ('LIVE', 'CLOSED', 'SCHEDULED') INNER JOIN `vehicles` AS `vehicle` ON `sale`.`vehicleId` = `vehicle`.`id` AND `vehicle`.`deletedAt` IS NULL INNER JOIN `pointOfSales` AS `vehicle->pointofsale` ON `vehicle`.`pointOfSaleId` = `vehicle->pointofsale`.`id`)      AS `sale`" +
        '   LEFT OUTER JOIN `saleOffers` AS `saleoffers` ON `sale`.`id` = `saleoffers`.`saleId` LEFT OUTER JOIN `users` AS `user` ON `sale`.`ownerId` = `user`.`id` LEFT OUTER JOIN `salesBookmarks` AS `salebookmarks` ON `sale`.`id` = `salebookmarks`.`saleId` group by sale.id\n)',
    );
  },
};
