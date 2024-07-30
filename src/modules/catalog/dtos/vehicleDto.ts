import {
  PointofsaleAdminShortDto,
  PointofsalePublicFullDto,
  PointofsalePublicShortDto,
} from '../../pointofsale/dtos/pointofsaleDto';

export interface VehicleAdminFullDto {
  id?: number;
  uuid?: string;
  fileNumber?: string;
  registration?: string;
  purchaseDate?: Date;
  brandLabel?: string;
  modelLabel?: string;
  color?: string;
  versionLabel?: string;
  firstRegistrationDate?: Date;
  profileCosts?: string;
  carPictures?: any; // TODO set DTO
  pointOfSaleId?: number;
  pointofsale?: PointofsaleAdminShortDto;
  keyPoints?: any; // TODO set DTO
  documents?: any; // TODO set DTO
  declaredEquipments?: any; // TODO set DTO
  constructorEquipments?: any; // TODO set DTO
  mileage?: number;
  fuelLabel?: string;
  liter?: number;
  gearBoxLabel?: string;
  seats?: number;
  door?: number;
  ch?: number;
  kw?: number;
  fiscal?: number;
  wheelsFrontDimensions?: any; // TODO set DTO
  wheelsBackDimensions?: any; // TODO set DTO
  wheelsFrontTireBrand?: string;
  wheelsBackTireBrand?: string;
  rimTypeFront?: string;
  rimTypeBack?: string;
  metallic?: boolean;
  gcDate?: Date;
  firstHand?: boolean;
  vehicleType?: string;
  co2?: number;
  origin?: string;
  purchaseInvoice?: string;
  vat?: boolean;
  vatDetails?: string;
  userId?: string;
  userManual?: string;
  secondSetKey?: string;
  damages?: any; // TODO set DTO
  imported?: boolean;
  profileBodyCosts?: string;
  vin?: string;
  active?: boolean;
  groupId?: number;
  listId?: number;
  carPicturesOthers?: any;
  carPicturesMain?: any;
  offersCount?: number;
  requestWinner?: boolean;

  //SERVICING
  servicingHistory?: string;
  servicingInBrandNetwork?: boolean;
  servicingManualPicture?: string;
  servicingInvoices?: boolean;
  lastServicingDate?: string;
  lastServicingKm?: number;
  distributionBelt?: string;
  nextTechnicalCheckDate?: string;
  reconditioningCostsMerchant?: number;

  //MARKET
  b2cMarketValue?: number;
  standardMileage?: number;
  dpaProAmt?: number;
  salesSpeedName?: string;
  marketLink?: string;
  marketDataDate?: Date;
  createdAt?: Date;
  entryStockDate?: Date;
}

export interface VehiclePublicFullDto {
  uuid: string;

  characteristics: {
    mileage: number;
    firstRegistrationDate: Date;
    fuelLabel: string;
    liter: number;
    gearBoxLabel: string;
    seats: number;
    door: number;
    color?: string;
    metallic: boolean;
    power: {
      ch: number;
      kw: number;
    };
    fiscal: number;
    wheelsFrontDimensions: any;
    wheelsBackDimensions: any;
    wheelsFrontTireBrand: string;
    wheelsBackTireBrand: string;
    rimTypeFront: string;
    rimTypeBack: string;
  };
  administrativeDetails: {
    gcDate: Date;
    firstHand: boolean;
    vehicleType: string;
    co2: number;
    userManual: string;
    secondSetKey: string;
  };

  history: {
    origin: string;
    purchaseInvoice: string;
    vat: boolean;
    vatDetails: string;
    imported: boolean;
  };

  fileNumber?: string;
  registration?: string;
  purchaseDate?: Date;
  brandLabel?: string;
  modelLabel?: string;
  versionLabel?: string;

  profileCosts?: string;
  gallery?: any;
  pointOfSaleId?: number;
  pointofsale?: PointofsalePublicFullDto;
  keyPoints?: any;
  documents?: any;
  declaredEquipments?: any;
  constructorEquipments?: any;
  rankedConstructorEquipments?: any;

  userId?: string;
  damages?: any;
  profileBodyCosts?: string;
  vin?: string;
  active?: boolean;
  groupId?: number;
  listId?: number;
  carPicturesOthers?: any;
  carPicturesMain?: any;
  offersCount?: number;
  requestWinner?: boolean;

  servicing: {
    servicingHistory: string;
    servicingInBrandNetwork: boolean;
    servicingManualPicture: string;
    servicingInvoices: boolean;
    lastServicingDate: string;
    lastServicingKm: number;
    distributionBelt: string;
    nextTechnicalCheckDate: string;
  };
  frevo: {
    reconditioningCostsMerchant: number;
  };
  market: {
    b2cMarketValue: number;
    standardMileage: number;
    dpaProAmt: number;
    salesSpeedName: string;
    marketLink: string;
    marketDataDate: Date;
  };
  entryStockDate?: Date;
}

export interface VehiclePublicShortDto {
  uuid: string;
  brandLabel: string;
  modelLabel: string;
  versionLabel: string;
  featuredPicture: string;
  profileBodyCosts: string;
  firstRegistrationDate: Date;
  fuelLabel: string;
  mileage: number;
  gallery?: any;
  pointofsale?: PointofsalePublicShortDto;
  b2cMarketValue: number;
  standardMileage: number;
  dpaProAmt: number;
  salesSpeedName: string;
}

export interface VehicleAdminShortDto {
  id: number;
  fileNumber: string;
  registration: string;
  brandLabel: string;
  modelLabel: string;
  versionLabel: string;
  firstRegistrationDate: Date;
  fuelLabel: string;
  mileage: number;
  pointofsale: PointofsaleAdminShortDto;
  b2cMarketValue: number;
  standardMileage: number;
  dpaProAmt: number;
  salesSpeedName: string;
  createdAt: Date;
}
