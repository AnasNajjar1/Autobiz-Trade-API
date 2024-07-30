'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE PROCEDURE _test_sale_create()
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
    
      #intialize (should be call after every insert and update in code)
      CALL calcSales(@newSaleId);
    
      #this is a new sale :inital count offers should be 0
      SET @countOffers = (SELECT countOffers FROM sales WHERE id = @newSaleId);
      IF @countOffers <> 0 THEN
        SELECT 'FAIL : countOffers <> 0';
        SET @fail = true;
      END IF;
    
      #this is a new sale :inital count auctions should be 0
      SET @countAuctions = (SELECT countAuctions FROM sales WHERE id = @newSaleId);
      IF @countAuctions <> 0 THEN
        SELECT 'FAIL : countAuctions <> 0';
        SET @fail = true;
      END IF;
    
      #this is a new sale :inital minimalAuction should be = auctionStartPrice
      SET @minimalAuction = (SELECT minimalAuction FROM sales WHERE id = @newSaleId);
      IF @minimalAuction <> @auctionStartPrice THEN
        SELECT 'FAIL : minimalAuction <> auctionStartPrice';
        SET @fail = true;
      END IF;
    
      #this is a new sale :inital bestOfferType should be null
      SET @bestOfferType = (SELECT bestOfferType FROM sales WHERE id = @newSaleId);
      IF @bestOfferType IS NOT NULL THEN
        SELECT 'FAIL : bestOfferType IS NOT NULL';
        SET @fail = true;
      END IF;
    
      #this is a new sale :inital bestOfferer should be null
      SET @bestOfferer = (SELECT bestOfferer FROM sales WHERE id = @newSaleId);
      IF @bestOfferer IS NOT NULL THEN
        SELECT 'FAIL : bestOfferer IS NOT NULL';
        SET @fail = true;
      END IF;
    
      #this is a new sale :inital winner should be null
      SET @winner = (SELECT winner FROM sales WHERE id = @newSaleId);
      IF @winner IS NOT NULL THEN
        SELECT 'FAIL : winner IS NOT NULL';
        SET @fail = true;
      END IF;
    
    
      #no fails : PASS
      IF @fail = false THEN
        SELECT 'PASS: _test_sale_create()';
      END IF;
      
    
      ROLLBACK;
    END
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `DROP PROCEDURE IF EXISTS _test_sale_create`,
    );
  },
};
