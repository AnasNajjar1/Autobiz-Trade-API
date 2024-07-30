'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE OR REPLACE PROCEDURE calcSales(IN paramSaleId INTEGER)
    BEGIN
      set @countOffers           = (SELECT count(*) FROM saleOffers WHERE saleId = paramSaleId);
      set @countAuctions         = (SELECT count(*) FROM saleOffers WHERE offerType = "auction" AND saleId = paramSaleId);
      set @minimalAuction        = 0;
      set @bestAuction           = (SELECT MAX(amount) FROM saleOffers WHERE offerType = "auction" AND saleId = paramSaleId);
      set @bestOfferType         = NULL;
      set @bestOfferer           = NULL;
      set @winner                = NULL;
      set @auctionReservePrice   = (SELECT IFNULL(auctionReservePrice,0) FROM sales WHERE id = paramSaleId);
      set @immediatePurchaseDate = (SELECT min(createdAt) FROM saleOffers WHERE offerType = "immediatePurchase" AND saleId = paramSaleId);
    
      IF @bestAuction IS NULL THEN
        set @minimalAuction = (SELECT sales.auctionStartPrice FROM sales WHERE id = paramSaleId);
      ELSE
        set @minimalAuction = @bestAuction + (SELECT sales.auctionStepPrice FROM sales WHERE id = paramSaleId);
      END IF;
    
    
      IF @immediatePurchaseDate IS NOT NULL THEN
        UPDATE sales 
          SET 
          sales.endDateTime = @immediatePurchaseDate
        WHERE sales.id = paramSaleId;
      
        set @bestOfferType = "immediatePurchase";
        set @bestOfferer = (SELECT userId FROM saleOffers WHERE offerType = "immediatePurchase" AND saleId = paramSaleId  LIMIT 1);
        set @winner = @bestOfferer;
      
      ELSE
                                
        set @bestOfferType = (	SELECT DISTINCT offerType
                    FROM saleOffers 
                    WHERE saleId = paramSaleId
                    AND offerType <> 'immediatePurchase'
                    AND amount = (	SELECT MAX(amount)
                            FROM saleOffers 
                            WHERE saleId =paramSaleId
                            AND offerType <> 'immediatePurchase'));
        
        set @bestOfferer = ( 	SELECT userId
                    FROM saleOffers 
                    WHERE saleId = paramSaleId
                    AND offerType <> 'immediatePurchase'
                    AND amount = (	SELECT MAX(amount)
                            FROM saleOffers 
                            WHERE saleId = paramSaleId
                            AND offerType <> 'immediatePurchase')
                                ORDER BY createdAt DESC
                    LIMIT 1);
                  
          
        IF @bestAuction >= @auctionReservePrice THEN
          set @winner = @bestOfferer;
        END IF;
        
      END IF;
    
      UPDATE sales
        SET
        sales.countOffers = @countOffers,
        sales.countAuctions = @countAuctions,
        sales.minimalAuction = @minimalAuction,
        sales.bestAuction = @bestAuction,
        sales.bestOfferType = @bestOfferType,
        sales.bestOfferer = @bestOfferer,
        sales.winner = @winner
    
      WHERE sales.id = paramSaleId;
    END
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    CREATE OR REPLACE PROCEDURE calcSales(IN paramSaleId INTEGER)
    BEGIN
      set @countOffers           = (SELECT count(*) FROM saleOffers WHERE saleId = paramSaleId);
      set @countAuctions         = (SELECT count(*) FROM saleOffers WHERE offerType = "auction" AND saleId = paramSaleId);
      set @minimalAuction        = 0;
      set @bestAuction           = (SELECT MAX(amount) FROM saleOffers WHERE offerType = "auction" AND saleId = paramSaleId);
      set @bestOfferType         = NULL;
      set @bestOfferer           = NULL;
      set @winner                = NULL;
      set @auctionReservePrice   = (SELECT IFNULL(auctionReservePrice,0) FROM sales WHERE id = paramSaleId);
      set @assignedWinner        = (SELECT assignedWinner FROM sales WHERE id = paramSaleId);
      set @immediatePurchaseDate = (SELECT min(createdAt) FROM saleOffers WHERE offerType = "immediatePurchase" AND saleId = paramSaleId);
    
      IF @bestAuction IS NULL THEN
        set @minimalAuction = (SELECT sales.auctionStartPrice FROM sales WHERE id = paramSaleId);
      ELSE
        set @minimalAuction = @bestAuction + (SELECT sales.auctionStepPrice FROM sales WHERE id = paramSaleId);
      END IF;
    
    
      IF @immediatePurchaseDate IS NOT NULL THEN
        UPDATE sales 
          SET 
          sales.endDateTime = @immediatePurchaseDate
        WHERE sales.id = paramSaleId;
      
        set @bestOfferType = "immediatePurchase";
        set @bestOfferer = (SELECT userId FROM saleOffers WHERE offerType = "immediatePurchase" AND saleId = paramSaleId  LIMIT 1);
        set @winner = @bestOfferer;
      
      ELSE
                                
        set @bestOfferType = (	SELECT DISTINCT offerType
                    FROM saleOffers 
                    WHERE saleId = paramSaleId
                    AND offerType <> 'immediatePurchase'
                    AND amount = (	SELECT MAX(amount)
                            FROM saleOffers 
                            WHERE saleId =paramSaleId
                            AND offerType <> 'immediatePurchase'));
        
        set @bestOfferer = ( 	SELECT userId
                    FROM saleOffers 
                    WHERE saleId = paramSaleId
                    AND offerType <> 'immediatePurchase'
                    AND amount = (	SELECT MAX(amount)
                            FROM saleOffers 
                            WHERE saleId = paramSaleId
                            AND offerType <> 'immediatePurchase')
                                ORDER BY createdAt DESC
                    LIMIT 1);
                  
          
        IF @bestAuction >= @auctionReservePrice THEN
          set @winner = @bestOfferer;
        
        ELSE
          IF @assignedWinner IS NOT NULL THEN
            set @winner = @assignedWinner;
          ELSE
            set @winner = NULL;
          END IF;
        END IF;
        
      END IF;
    
      UPDATE sales
        SET
        sales.countOffers = @countOffers,
        sales.countAuctions = @countAuctions,
        sales.minimalAuction = @minimalAuction,
        sales.bestAuction = @bestAuction,
        sales.bestOfferType = @bestOfferType,
        sales.bestOfferer = @bestOfferer,
        sales.winner = @winner
    
      WHERE sales.id = paramSaleId;
    END
    `);
  },
};
