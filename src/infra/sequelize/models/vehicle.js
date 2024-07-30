module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define(
    'vehicle',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      fileNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      registration: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      purchaseDate: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
      },
      brandLabel: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      modelLabel: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      versionLabel: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      firstRegistrationDate: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
      },
      profileCosts: {
        type: DataTypes.ENUM('A', 'B', 'C', 'D', 'E'),
        defaultValue: null,
      },
      carPictures: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      carPicturesOthers: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      pointOfSaleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: null,
      },
      keyPoints: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      documents: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      declaredEquipments: {
        type: DataTypes.TEXT,
      },
      constructorEquipments: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      mileage: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: null,
      },
      fuelLabel: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      liter: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      gearBoxLabel: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      seats: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      door: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      ch: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      kw: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      fiscal: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      wheelsFrontDimensions: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      wheelsBackDimensions: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      wheelsFrontTireBrand: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      wheelsBackTireBrand: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      rimTypeFront: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      rimTypeBack: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      metallic: {
        type: DataTypes.BOOLEAN,
        defaultValue: null,
      },
      gcDate: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
      },
      firstHand: {
        type: DataTypes.BOOLEAN,
        defaultValue: null,
      },
      vehicleType: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      co2: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      origin: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      purchaseInvoice: {
        type: DataTypes.STRING(2048),
        defaultValue: null,
      },
      vat: {
        type: DataTypes.BOOLEAN,
        defaultValue: null,
      },
      vatDetails: {
        type: DataTypes.STRING(20),
        defaultValue: null,
      },
      servicingHistory: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      servicingInBrandNetwork: {
        type: DataTypes.BOOLEAN,
        defaultValue: null,
      },
      servicingManualPicture: {
        type: DataTypes.STRING(2048),
        defaultValue: null,
      },
      servicingInvoices: {
        type: DataTypes.BOOLEAN,
        defaultValue: null,
      },
      lastServicingDate: {
        type: DataTypes.STRING(7),
        defaultValue: null,
      },
      lastServicingKm: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      distributionBelt: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      nextTechnicalCheckDate: {
        type: DataTypes.STRING(7),
        defaultValue: null,
      },
      reconditioningCostsMerchant: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      marketLink: {
        type: DataTypes.STRING(2048),
        defaultValue: null,
      },
      b2cMarketValue: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: null,
      },
      standardMileage: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: null,
      },
      userId: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      createdBy: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      updatedBy: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      deletedAt: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
      },
      deletedBy: {
        type: DataTypes.STRING,
        defaultValue: null,
      },

      damages: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },
      userManual: {
        type: DataTypes.STRING(6),
        defaultValue: null,
      },
      secondSetKey: {
        type: DataTypes.STRING(6),
        defaultValue: null,
      },
      imported: {
        type: DataTypes.BOOLEAN,
        defaultValue: null,
      },
      profileBodyCosts: {
        type: DataTypes.STRING(3),
        defaultValue: null,
      },
      vin: {
        type: DataTypes.STRING(765),
        defaultValue: null,
      },
      dpaProAmt: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      salesSpeedName: {
        type: DataTypes.STRING(10),
        defaultValue: null,
      },
      entryStockDate: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
      },
      marketDataDate: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
      },
      color: {
        type: DataTypes.STRING(60),
        defaultValue: null,
      },
      thumbnail: {
        type: DataTypes.STRING(256),
        defaultValue: null,
      },
    },
    { tableName: 'vehicles', paranoid: true },
  );

  Vehicle.associate = function (models) {
    Vehicle.belongsTo(models.pointofsale, {
      foreignKey: 'pointOfSaleId',
    });
    Vehicle.hasOne(models.sale);
  };

  return Vehicle;
};
