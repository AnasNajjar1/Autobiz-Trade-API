'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE PROCEDURE _test_sale_update()
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
    
      #this is a new sale :inital minimalAuction should be = auctionStartPrice
      SET @minimalAuction = (SELECT minimalAuction FROM sales WHERE id = @newSaleId);
      IF @minimalAuction <> @auctionStartPrice THEN
        SELECT 'FAIL : minimalAuction <> auctionStartPrice';
        SET @fail = true;
      END IF;
    
      #JOE make a 1000 auction 
      INSERT INTO saleOffers (amount, offerType, userId, saleId) VALUES (1000, 'auction','JOE',@newSaleId);
    
      #it set minimalAuction to last best auction + auctionStepPrice
      SET @minimalAuction = (SELECT minimalAuction FROM sales WHERE id = @newSaleId);
      IF @minimalAuction <> (1000 + @auctionStepPrice) THEN
        SELECT 'FAIL : minimalAuction <> last best auction + auctionStepPrice';
      END IF;
    
      SET @winner = (SELECT winner FROM sales WHERE id = @newSaleId);
      IF @winner <> 'JOE' THEN
        SELECT 'FAIL : winner IS NOT JOE';
        SET @fail = true;
      END IF;
    
      #adding a reserve price greater than the JOE's offer (previously winner)
      UPDATE sales SET sales.auctionReservePrice = 3000 WHERE sales.id = @newSaleId;
    
      #recalc (should be call after every insert and update in code)
      CALL calcSales(@newSaleId);
    
      #Joe lost the winnership
      SET @winner = (SELECT winner FROM sales WHERE id = @newSaleId);
      IF @winner IS NOT NULL THEN
        SELECT 'FAIL : winner IS NOT NULL';
        SET @fail = true;
      END IF;
    
      #no fails : PASS
      IF @fail = false THEN
        SELECT 'PASS: _test_sale_update()';
      END IF;
      
      ROLLBACK;
    END
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `DROP PROCEDURE IF EXISTS _test_sale_update`,
    );
  },
};
