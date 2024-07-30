export interface UpdateVehicleRequestDto {
  id: number;
  vin?: string;
  fileNumber: string;

  brandLabel: string;
  modelLabel: string;
  versionLabel: string;
  firstRegistrationDate: Date;
  profileCosts: string;
  profileBodyCosts: string;

  carPictures: any;
  carPicturesOthers: any;

  damages: string[];

  pointofsale: { id: number };

  keyPoints: string[];

  documents: any[];

  declaredEquipments: string[];
  constructorEquipments: string[];

  mileage: number;
  fuelLabel: string;
  liter: number;
  gearBoxLabel: string;
  seats: number;
  door: number;
  ch: number;
  kw: number;
  fiscal: number;
  wheelsFrontDimensions: any;
  wheelsBackDimensions: any;
  wheelsFrontTireBrand: string;
  wheelsBackTireBrand: string;
  rimTypeFront: string;
  rimTypeBack: string;
  metallic: boolean;

  purchaseDate: Date;
  gcDate: Date;
  registration: string;
  firstHand: boolean;
  vehicleType: string;
  co2: number;
  userManual: string;
  secondSetKey: string;

  origin: string;
  purchaseInvoice: string;
  vat: boolean;
  vatDetails: string;
  imported: boolean;

  servicingHistory: string;
  servicingInBrandNetwork: boolean;
  servicingManualPicture: string;
  servicingInvoices: boolean;
  lastServicingDate: string;
  lastServicingKm: number;
  distributionBelt: string;
  nextTechnicalCheckDate: string;

  reconditioningCostsMerchant: number;

  b2cMarketValue: number;
  standardMileage: number;
  dpaProAmt: number;
  salesSpeedName: string;
  marketLink: string;

  updatedBy: string;
  entryStockDate?: Date;
  color?: string;
}
