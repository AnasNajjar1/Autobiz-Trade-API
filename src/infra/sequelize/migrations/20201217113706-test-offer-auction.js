'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE PROCEDURE _test_offer_auction()
    BEGIN
      START TRANSACTION;

      SET @auctionStartPrice = 500;
      SET @auctionStepPrice = 100;
      SET @fail = false;
    
      #creating a fake vehicle
      INSERT INTO vehicles (uuid,fileNumber) VALUES (uuid(),'XXX');
      SET @newVehicleId = LAST_INSERT_ID();
    
      #creating a fake sale
      INSERT INTO sales (uuid, vehicleId, auctionStartPrice, auctionStepPrice) VALUES (uuid(), @newVehicleId,@auctionStartPrice,@auctionStepPrice);
      SET @newSaleId = LAST_INSERT_ID();
    
    
      #ANA make a 200 submission 
      INSERT INTO saleOffers (amount, offerType, userId, saleId) VALUES (200, 'submission','ANA',@newSaleId);
    
      #JOE make a 1000 auction 
      INSERT INTO saleOffers (amount, offerType, userId, saleId) VALUES (1000, 'auction','JOE',@newSaleId);
    
      #it incremements countOffers in sales
      SET @countOffers = (SELECT countOffers FROM sales WHERE id = @newSaleId);
      IF @countOffers <> 2 THEN
        SELECT 'FAIL : countOffers <> 2';
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
    
      #bestOfferType must be auction
      SET @bestOfferType = (SELECT bestOfferType FROM sales WHERE id = @newSaleId);
      IF @bestOfferType <> 'auction' THEN
        SELECT 'FAIL : bestOfferType IS NOT auction';
        SET @fail = true;
      END IF;
    
      #it sets this auction user to best Offerer JOE
      SET @bestOfferer = (SELECT bestOfferer FROM sales WHERE id = @newSaleId);
      IF @bestOfferer <> 'JOE' THEN
        SELECT 'FAIL : bestOfferer IS NOT JOE';
        SET @fail = true;
      END IF;
    
      #it sets this user as winner JOE
      SET @winner = (SELECT winner FROM sales WHERE id = @newSaleId);
      IF @winner <> 'JOE' THEN
        SELECT 'FAIL : winner IS NOT JOE';
        SET @fail = true;
      END IF;
    
      #ANA make a better bid
      INSERT INTO saleOffers (amount, offerType, userId, saleId) VALUES (1100, 'auction','ANA',@newSaleId);	
    
      #it sets this auction user to best Offerer ANA
      SET @bestOfferer = (SELECT bestOfferer FROM sales WHERE id = @newSaleId);
      IF @bestOfferer <> 'ANA' THEN
        SELECT 'FAIL : bestOfferer IS NOT ANA';
        SET @fail = true;
      END IF;
    
      #it sets this user as winner ANA
      SET @winner = (SELECT winner FROM sales WHERE id = @newSaleId);
      IF @winner <> 'ANA' THEN
        SELECT 'FAIL : winner IS NOT ANA';
        SET @fail = true;
      END IF;
    
    
      #creating another new fake vehicle
      INSERT INTO vehicles (uuid,fileNumber) VALUES (uuid(),'YYY');
      SET @anotherNewVehicleId = LAST_INSERT_ID();
    
      #creating another fake sale with same parameters but with a reserve price 2000
      INSERT INTO sales (uuid, vehicleId, auctionStartPrice, auctionStepPrice, auctionReservePrice) VALUES (uuid(), @anotherNewVehicleId,@auctionStartPrice,@auctionStepPrice, 2000);
      SET @anotherNewSaleId = LAST_INSERT_ID();
    
    
      #TOM make a 1000 auction 
      INSERT INTO saleOffers (amount, offerType, userId, saleId) VALUES (1000, 'auction','TOM',@anotherNewSaleId);
    
      #it sets this auction user to best Offerer TOM
      SET @bestOfferer = (SELECT bestOfferer FROM sales WHERE id = @anotherNewSaleId);
      IF @bestOfferer <> 'TOM' THEN
        SELECT 'FAIL : bestOfferer IS NOT TOM';
        SET @fail = true;
      END IF;
    
      #Reserve price is not reached : Tom is best offerer 
      SET @bestOfferer = (SELECT bestOfferer FROM sales WHERE id = @anotherNewSaleId);
      IF @bestOfferer <> 'TOM' THEN
        SELECT 'FAIL : bestOfferer IS NOT TOM';
        SET @fail = true;
      END IF;
    
      #but not winner
      SET @winner = (SELECT winner FROM sales WHERE id = @anotherNewSaleId);
      IF @winner IS NOT NULL THEN
        SELECT 'FAIL : winner IS TOM';
        SET @fail = true;
      END IF;
    
      #UDO make a 2500 auction = exact reservePrice
      INSERT INTO saleOffers (amount, offerType, userId, saleId) VALUES (2500, 'auction','UDO',@anotherNewSaleId);
      SET @winner = (SELECT winner FROM sales WHERE id = @anotherNewSaleId);
      IF @winner <> 'UDO' THEN
        SELECT 'FAIL : winner IS NOT UDO';
        SET @fail = true;
      END IF;
    
    
      # no fails : PASS
      IF @fail = false THEN
        SELECT 'PASS: _test_offer_auction()';
      END IF;
    
      ROLLBACK;
    END
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `DROP PROCEDURE IF EXISTS _test_offer_auction`,
    );
  },
};
