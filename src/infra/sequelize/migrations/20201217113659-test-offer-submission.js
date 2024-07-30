'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE PROCEDURE _test_offer_submission()
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
    
      #creating a submission 
      INSERT INTO saleOffers (amount, offerType, userId, saleId) VALUES (100, 'submission','JOE',@newSaleId);
    
    
      #it incremements countOffers in sales
      SET @countOffers = (SELECT countOffers FROM sales WHERE id = @newSaleId);
      IF @countOffers <> 1 THEN
        SELECT 'FAIL : countOffers <> 1 increments';
        SET @fail = true;
      END IF;
    
      #creating a unwanted submission 
      INSERT INTO saleOffers (amount, offerType, userId, saleId) VALUES (666, 'submission','JOE',@newSaleId);
      SET @unwantedOfferId = LAST_INSERT_ID();
    
      #it incremements countOffers in sales
      SET @countOffers = (SELECT countOffers FROM sales WHERE id = @newSaleId);
      IF @countOffers <> 2 THEN
        SELECT 'FAIL : countOffers <> 2';
        SET @fail = true;
      END IF;
    
      #deleting the unwanted submission 
      DELETE FROM saleOffers where id = @unwantedOfferId;
    
      #it decremements countOffers in sales
      SET @countOffers = (SELECT countOffers FROM sales WHERE id = @newSaleId);
      IF @countOffers <> 1 THEN
        SELECT 'FAIL : countOffers <> 1 decrements';
        SET @fail = true;
      END IF;
    
      #it not incremements countAuctions in sales
      SET @countAuctions = (SELECT countAuctions FROM sales WHERE id = @newSaleId);
      IF @countAuctions <> 0 THEN
        SELECT 'FAIL : countAuctions <> 0';
        SET @fail = true;
      END IF;
    
      #it does nothing with minimalAuction
      SET @minimalAuction = (SELECT minimalAuction FROM sales WHERE id = @newSaleId);
      IF @minimalAuction <> @auctionStartPrice THEN
        SELECT 'FAIL : minimalAuction <> auctionStartPrice';
      END IF;
    
      #it does nothing with bestAuction
      SET @bestOfferType = (SELECT bestOfferType FROM sales WHERE id = @newSaleId);
      IF @bestOfferType <> 'submission' THEN
        SELECT 'FAIL : bestOfferType IS NOT submission';
        SET @fail = true;
      END IF;
    
      #it sets this submission user to best Offerer 
      SET @bestOfferer = (SELECT bestOfferer FROM sales WHERE id = @newSaleId);
      IF @bestOfferer <> 'JOE' THEN
        SELECT 'FAIL : bestOfferer IS NOT NULL';
      END IF;
    
      #it not sets this user as winner
      SET @winner = (SELECT winner FROM sales WHERE id = @newSaleId);
      IF @winner IS NOT NULL THEN
        SELECT 'FAIL : winner IS NOT NULL';
        SET @fail = true;
      END IF;
    
      #assign a winner by admin
      UPDATE sales SET assignedWinner = 'JOE' WHERE id = @newSaleId;
      # updating the calc 
      CALL calcSales(@newSaleId);
    
      
      # winner is still null
      IF @winner IS NULL THEN
        SELECT 'FAIL : assigned winner JOE is not winner';
        SET @fail = true;
      END IF;
      
    
      # no fails : PASS
      IF @fail = false THEN
        SELECT 'PASS: _test_offer_submission()';
      END IF;
      
      ROLLBACK;
    END
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `DROP PROCEDURE IF EXISTS _test_offer_submission`,
    );
  },
};
