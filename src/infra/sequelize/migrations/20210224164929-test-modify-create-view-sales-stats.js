'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE OR REPLACE PROCEDURE _test_salesStats_view()
    BEGIN
      START TRANSACTION;

      SET @fail = false;
      set @forFiftyOneDays = (SELECT SUBDATE(NOW(),51));
      set @forTwoDays = (SELECT SUBDATE(NOW(),2));
      set @yesterday = (SELECT SUBDATE(NOW(),1));
      set @oneHourAgo = (SELECT DATE_SUB(NOW(),INTERVAL 1 HOUR));
      set @tomorrow = (SELECT ADDDATE(NOW(),1));
      set @nextweek = (SELECT ADDDATE(NOW(),7));
    
    
      #creating a fake vehicle
      INSERT INTO vehicles (uuid,fileNumber) VALUES (uuid(),'XXX');
      SET @newVehicleId = LAST_INSERT_ID();
    
      #creating a fake DRAFT sale starting tomorrow and ending in one week
      INSERT INTO sales 
      (uuid, vehicleId,startDateTime,endDateTime,validationStatus) 
      VALUES 
      (uuid(), @newVehicleId,	@tomorrow,@nextweek,'DRAFT');
      SET @newSaleId = LAST_INSERT_ID();
    
    
      # a DRAFT sale should have a INACTIVE status 
      SET @status = (SELECT status FROM salesStats WHERE saleId = @newSaleId);
      IF @status <> "INACTIVE" THEN
        SELECT 'FAIL : A DRAFT sale should have a INACTIVE status';
        SET @fail = true;
      END IF;
    
      # a CANCELED sale should have a INACTIVE status 
      UPDATE sales SET validationStatus = "CANCELED" WHERE id = @newSaleId;
      SET @status = (SELECT status FROM salesStats WHERE saleId = @newSaleId);
      IF @status <> "INACTIVE" THEN
        SELECT 'FAIL : A CANCELED sale should have a INACTIVE status';
        SET @fail = true;
      END IF;
    
      #created sale is starting tomorrow and ending in one week, when updating to VALIDATED, it should have a SCHEDULED satus
      UPDATE sales SET validationStatus = "VALIDATED" WHERE id = @newSaleId;
      SET @status = (SELECT status FROM salesStats WHERE saleId = @newSaleId);
      IF @status <> "SCHEDULED" THEN
        SELECT 'FAIL : A VALIDATED sale starting tomorrow and ending in one week should have SCHEDULED status';
        SET @fail = true;
      END IF;
    
      #time passes : sale started yesterday
      #sale is starting yesterday and ending in 5 days, it should have a LIVE satus
      UPDATE sales SET startDateTime = @yesterday WHERE id = @newSaleId;
      SET @status = (SELECT status FROM salesStats WHERE saleId = @newSaleId);
      IF @status <> "LIVE" THEN
        SELECT 'FAIL : A VALIDATED sale starting yesterday and ending in 5 days, it should have a LIVE satus';
        SET @fail = true;
      END IF;
    
    
      #time passes : sale is ended for one hour
      #it should have a CLOSED satus
      UPDATE sales SET endDateTime = @oneHourAgo WHERE id = @newSaleId;
      SET @status = (SELECT status FROM salesStats WHERE saleId = @newSaleId);
      IF @status <> "CLOSED" THEN
        SELECT 'FAIL : A VALIDATED sale ended one hour ago should have a CLOSED satus';
        SET @fail = true;
      END IF;
    
      #time passes : sales is closed for two days
      #it should have a FINISHEd satus
      UPDATE sales SET endDateTime = @forTwoDays WHERE id = @newSaleId;
      SET @status = (SELECT status FROM salesStats WHERE saleId = @newSaleId);
      IF @status <> "FINISHED" THEN
        SELECT 'FAIL : A VALIDATED sale ended two days ago should have a FINISHED satus';
        SET @fail = true;
      END IF;
    
      #time passes : sales is closed for 51 days
      #it should have a ARCHIVED satus
      UPDATE sales SET endDateTime = @forFiftyOneDays WHERE id = @newSaleId;
      SET @status = (SELECT status FROM salesStats WHERE saleId = @newSaleId);
      IF @status <> "ARCHIVED" THEN
        SELECT 'FAIL : A VALIDATED sale ended 51 days ago should have a ARCHIVED satus';
        SET @fail = true;
      END IF;
    
    
    
      #no fails : PASS
      IF @fail = false THEN
        SELECT 'PASS: _test_salesStats_view()';
      END IF;
    
    
      ROLLBACK;
    END
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `DROP PROCEDURE IF EXISTS _test_salesStats_view`,
    );
  },
};
