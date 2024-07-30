'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE PROCEDURE `setSalesInfos`(IN paramSaleId INTEGER) BEGIN set @minimalAuction = 0; set @bestOfferType = ""; set @winner = NULL; set @bestOfferer = NULL; set @immediatePurchaseDate = (SELECT min(createdAt) FROM saleOffers WHERE saleType = "immediatePurchase" AND saleId = paramSaleId); set @countAuction = (SELECT count(*) FROM saleOffers WHERE saleType = "auction" AND saleId = paramSaleId); set @bestAuction = (SELECT MAX(amount) FROM saleOffers WHERE saleType = "auction" AND saleId = paramSaleId); set @auctionReservePrice = (SELECT IFNULL(auctionReservePrice,0) FROM sales WHERE id = paramSaleId); IF @bestAuction IS NULL THEN set @minimalAuction = (SELECT sales.auctionStartPrice FROM sales WHERE id = paramSaleId); ELSE set @minimalAuction = @bestAuction + (SELECT sales.auctionStepPrice FROM sales WHERE id = paramSaleId); END IF; IF @immediatePurchaseDate IS NOT NULL THEN UPDATE sales SET sales.endDateTime = @immediatePurchaseDate WHERE sales.id = paramSaleId; set @bestOfferType = "immediatePurchase"; set @bestOfferer = (SELECT userId FROM saleOffers WHERE saleType = "immediatePurchase" AND saleId = paramSaleId); set @winner = @bestOfferer; ELSE set @bestOfferType = (	SELECT DISTINCT saleType FROM saleOffers  WHERE saleId = paramSaleId AND saleType <> "immediatePurchase" AND amount = (SELECT MAX(amount) FROM saleOffers WHERE saleId =paramSaleId AND saleType <> "immediatePurchase")); set @bestOfferer = (SELECT userId FROM saleOffers  WHERE saleId = paramSaleId AND saleType <> "immediatePurchase" AND amount = (SELECT MAX(amount) FROM saleOffers WHERE saleId = paramSaleId AND saleType <> "immediatePurchase") ORDER BY createdAt DESC LIMIT 1); IF @bestAuction >= @auctionReservePrice THEN set @winner = @bestOfferer; ELSE set @winner = NULL; END IF; END IF; UPDATE sales SET sales.countAuctions = @countAuction, sales.minimalAuction = @minimalAuction, sales.bestAuction = @bestAuction, sales.bestOfferType = @bestOfferType, sales.winner = @winner, sales.bestOfferer = @bestOfferer WHERE sales.id = paramSaleId; END',
    );

    await queryInterface.sequelize.query(`
      CREATE TRIGGER afterInsterOffer
      AFTER INSERT
      ON saleOffers FOR EACH ROW
      BEGIN
        CALL setSalesInfos(NEW.saleId);
      END
      `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER afterUpdateOffer
      AFTER UPDATE 
      ON saleOffers FOR EACH ROW
      BEGIN
        CALL setSalesInfos(OLD.saleId);
        CALL setSalesInfos(NEW.saleId);
      END
      `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER afterDeleteOffer
      AFTER DELETE
      ON saleOffers FOR EACH ROW
      BEGIN
        CALL setSalesInfos(OLD.saleId);
      END
      `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`DROP PROCEDURE setSalesInfos`);
    await queryInterface.sequelize.query(`DROP TRIGGER afterDeleteOffer`);
    await queryInterface.sequelize.query(`DROP TRIGGER afterUpdateOffer`);
    await queryInterface.sequelize.query(`DROP TRIGGER afterInsterOffer`);
  },
};
