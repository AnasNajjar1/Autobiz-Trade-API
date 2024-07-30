'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('vehicles', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER(11).UNSIGNED,
        },
        uuid: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        fileNumber: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        registration: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        purchaseDate: {
          type: Sequelize.DATEONLY,
          defaultValue: null,
        },
        statusId: {
          type: Sequelize.INTEGER(11).UNSIGNED,
          allowNull: false,
        },
        offerType: {
          type: Sequelize.ENUM('stock', 'offerToPrivate'),
          defaultValue: null,
        },
        salesComment: {
          type: Sequelize.TEXT,
          defaultValue: null,
        },
        salesCommentInt: {
          type: Sequelize.TEXT,
          defaultValue: null,
        },
        brandLabel: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        },
        modelLabel: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        },
        versionLabel: {
          type: Sequelize.STRING,
          defaultValue: null,
        },
        firstRegistrationDate: {
          type: Sequelize.DATEONLY,
          defaultValue: null,
        },
        profileCosts: {
          type: Sequelize.ENUM('A', 'B', 'C', 'D', 'E'),
          defaultValue: null,
        },
        carPictures: {
          type: Sequelize.TEXT,
          defaultValue: null,
        },
        pointOfSaleId: {
          type: Sequelize.INTEGER(11).UNSIGNED,
          allowNull: true,
          defaultValue: null,
          references: {
            model: 'pointOfSales',
            key: 'id',
          },
        },
        keyPoints: {
          type: Sequelize.TEXT,
          defaultValue: null,
        },
        documents: {
          type: Sequelize.TEXT,
          defaultValue: null,
        },
        declaredEquipments: {
          type: Sequelize.TEXT,
          defaultValue: null,
        },
        constructorEquipments: {
          type: Sequelize.TEXT,
          defaultValue: null,
        },
        mileage: {
          type: Sequelize.INTEGER(11).UNSIGNED,
          defaultValue: null,
        },
        fuelLabel: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        liter: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        gearBoxLabel: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        seats: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        door: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        ch: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        kw: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        fiscal: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        wheelsFrontDimensions: {
          type: Sequelize.TEXT,
          defaultValue: null,
        },
        wheelsBackDimensions: {
          type: Sequelize.TEXT,
          defaultValue: null,
        },
        wheelsFrontTireBrand: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        wheelsBackTireBrand: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        rimTypeFront: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        rimTypeBack: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        metallic: {
          type: Sequelize.BOOLEAN,
          defaultValue: null,
        },
        gcDate: {
          type: Sequelize.DATEONLY,
          defaultValue: null,
        },
        firstHand: {
          type: Sequelize.BOOLEAN,
          defaultValue: null,
        },
        vehicleType: {
          type: Sequelize.STRING,
          defaultValue: null,
        },
        co2: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        origin: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        purchaseInvoice: {
          type: Sequelize.STRING(2048),
          defaultValue: null,
        },
        vat: {
          type: Sequelize.BOOLEAN,
          defaultValue: null,
        },
        servicingHistory: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        servicingInBrandNetwork: {
          type: Sequelize.BOOLEAN,
          defaultValue: null,
        },
        servicingManualPicture: {
          type: Sequelize.STRING(2048),
          defaultValue: null,
        },
        servicingInvoices: {
          type: Sequelize.BOOLEAN,
          defaultValue: null,
        },
        lastServicingDate: {
          type: Sequelize.STRING(7),
          defaultValue: null,
        },
        lastServicingKm: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        distributionBelt: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        nextTechnicalCheckDate: {
          type: Sequelize.STRING(7),
          defaultValue: null,
        },
        marketLink: {
          type: Sequelize.STRING(2048),
          defaultValue: null,
        },
        b2cMarketValue: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: null,
        },
        standardMileage: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: null,
        },
        userId: {
          type: Sequelize.STRING(50),
          defaultValue: null,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('now'),
          allowNull: false,
        },
        updatedAt: Sequelize.DATE,
        deletedAt: {
          type: Sequelize.DATE,
          defaultValue: null,
        },
        damages: {
          type: Sequelize.TEXT,
          defaultValue: null,
        },
        userManual: {
          type: Sequelize.TINYINT(4),
          defaultValue: null,
        },
        secondSetKey: {
          type: Sequelize.TINYINT(4),
          defaultValue: null,
        },
        imported: {
          type: Sequelize.TINYINT(4),
          defaultValue: null,
        },
        active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: 1,
        },
        profileBodyCosts: {
          type: Sequelize.STRING(3),
          defaultValue: null,
        },
        vin: {
          type: Sequelize.STRING(765),
          defaultValue: null,
        },
        dpaProAmt: {
          type: Sequelize.INTEGER,
          defaultValue: null,
        },
        salesSpeedName: {
          type: Sequelize.STRING(10),
          defaultValue: null,
        },
      })
      .then(() => {
        queryInterface.dele;
        queryInterface.addIndex('vehicles', ['uuid']);
        queryInterface.addIndex('vehicles', ['brandLabel']);
        queryInterface.addIndex('vehicles', ['modelLabel']);
        queryInterface.addIndex('vehicles', ['fuelLabel']);
        queryInterface.addIndex('vehicles', ['gearBoxLabel']);
        queryInterface.addIndex('vehicles', ['vehicleType']);

        queryInterface.addIndex(
          'vehicles',
          ['brandLabel', 'modelLabel', 'versionLabel', 'fileNumber'],
          {
            type: 'FULLTEXT',
            name: 'brandLabel_modelLabel_versionLabel',
          },
        );

        queryInterface.sequelize.query(`
          ALTER TABLE vehicles 
          ADD CONSTRAINT FK_vehicles_statuses 
          FOREIGN KEY (statusId) REFERENCES statuses(id) ON DELETE RESTRICT ON UPDATE CASCADE;
        `);
      });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('vehicles');
  },
};
