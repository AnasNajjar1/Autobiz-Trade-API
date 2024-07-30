'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE PROCEDURE _test_offer_immediate_purchase()
    BEGIN
      START TRANSACTION;
    
      SET @auctionStartPrice = 500;
      SET @auctionStepPrice = 100;
      SET @immediatePurchasePrice = 6000;
      SET @fail = false;
      set @yesterday = (SELECT SUBDATE(NOW(),1));
      set @tomorrow = (SELECT ADDDATE(NOW(),1));
    
    
      #creating a fake vehicle
      INSERT INTO vehicles (uuid,fileNumber) VALUES (uuid(),'XXX');
      SET @newVehicleId = LAST_INSERT_ID();
    
      #creating a fake sale
      INSERT INTO sales 
      (uuid, vehicleId,auctionStartPrice, auctionStepPrice, immediatePurchasePrice, startDateTime, endDateTime, validationStatus) 
      VALUES 
      (uuid(), @newVehicleId,	@auctionStartPrice, @auctionStepPrice, @immediatePurchasePrice, @yesterday, @tomorrow, 'VALIDATED');
      SET @newSaleId = LAST_INSERT_ID();
    
    
      # sale started yesterday till tomorrow it should be LIVE 
      SET @status = (SELECT status FROM salesStats WHERE saleId = @newSaleId);
      IF @status <> "LIVE" THEN
        SELECT 'FAIL : status is not LIVE';
        SET @fail = true;
      END IF;
    
      #ANA make a 200 submission 
      INSERT INTO saleOffers (amount, offerType, userId, saleId) VALUES (200, 'submission','ANA',@newSaleId);
    
      #BOB make a 1000 auction 
      INSERT INTO saleOffers (amount, offerType, userId, saleId) VALUES (1000, 'auction','JOE',@newSaleId);
    
      #KIM make a 6000 immediate purchase 
      INSERT INTO saleOffers (amount, offerType, userId, saleId) VALUES (1000, 'immediatePurchase','KIM',@newSaleId);
    
      #it incremements countOffers in sales
      SET @countOffers = (SELECT countOffers FROM sales WHERE id = @newSaleId);
      IF @countOffers <> 3 THEN
        SELECT 'FAIL : countOffers <> 3';
        SET @fail = true;
      END IF;
    
      #it incremements countAuctions in sales
      SET @countAuctions = (SELECT countAuctions FROM sales WHERE id = @newSaleId);
      IF @countAuctions <> 1 THEN
        SELECT 'FAIL : countAuctions <> 1';
        SET @fail = true;
      END IF;
    
      #it set minimalAuction to last best auction + auctionStepPrice (code will not autorize to make a auction < bestauction)
      SET @minimalAuction = (SELECT minimalAuction FROM sales WHERE id = @newSaleId);
      IF @minimalAuction <> (1000 + @auctionStepPrice) THEN
        SELECT 'FAIL : minimalAuction <> last best auction + auctionStepPrice';
      END IF;
    
      #bestOfferType must be KIM immediatePurchase
      SET @bestOfferType = (SELECT bestOfferType FROM sales WHERE id = @newSaleId);
      IF @bestOfferType <> 'immediatePurchase' THEN
        SELECT 'FAIL : bestOfferType IS NOT immediatePurchase';
        SET @fail = true;
      END IF;
    
      #it sets this immediatePurchase user to best Offerer KIM
      SET @bestOfferer = (SELECT bestOfferer FROM sales WHERE id = @newSaleId);
      IF @bestOfferer <> 'KIM' THEN
        SELECT 'FAIL : bestOfferer IS NOT KIM';
        SET @fail = true;
      END IF;
    
      #it sets this user as winner KIM
      SET @winner = (SELECT winner FROM sales WHERE id = @newSaleId);
      IF @winner <> 'KIM' THEN
        SELECT 'FAIL : winner IS NOT KIM';
        SET @fail = true;
      END IF;
    
      #endDateTime was updated in sales : Sale should be closed 
      SET @status = (SELECT status FROM salesStats WHERE saleId = @newSaleId);
      IF @status <> "CLOSED" THEN
        SELECT 'FAIL : status is not CLOSED';
        SET @fail = true;
      END IF;
    
    
      # no fails : PASS
      IF @fail = false THEN
        SELECT 'PASS: _test_offer_immediate_purchase()';
      END IF;
    
      ROLLBACK;
    END
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `DROP PROCEDURE IF EXISTS _test_offer_immediate_purchase`,
    );
  },
};
