export interface VehicleSaleImporRequestDto {
  uuid: string;
}
export interface importedSaleProps {
  startDateTime: Date;
  endDateTime: Date;
  acceptAuction: boolean;
  acceptImmediatePurchase: boolean;
  acceptSubmission: boolean;
  auctionStartPrice: number;
  auctionStepPrice: number;
  auctionReservePrice: number;
  immediatePurchasePrice: number;
  comment: string;
  groupId: number;
}

export type Country = 'ES' | 'FR' | 'IT' | 'NL' | 'PT' | 'UK';

export type vinAnalysis = 'yes' | 'no';

export interface vehicleIdentificationDto {
  vinAnalysis: vinAnalysis;
  registration: string;
  vin: string;
  country: Country;
}
export interface VehicleSaleImportDto {
  fileNumber?: string;
  createVehicle: boolean;
  vinAnalysis: vinAnalysis;
  country: Country;
  vin: string;
  registration: string;
  versionLabel: string;
  mileage: number;
  firstRegistrationDate?: Date;
  vat: boolean;
  pointOfSaleId: number;
  color?: string;
  door?: number;
  seats?: number;
  kw?: number;
  ch?: number;
  fiscal?: number;
  brandLabel?: string;
  modelLabel?: string;
  gcDate?: Date;
  co2?: number;
  liter?: number;
  fuelLabel?: string;
  gearBoxLabel?: string;
  vehicleType?: string;
  imported?: boolean;
  cgDate?: Date;
  nextTechnicalCheckDate?: string;
  lastServicingDate?: string;
  lastServicingKm?: number;
  servicingHistory?: string;
  createSale: boolean;
  startDateTime?: Date;
  endDateTime?: Date;
  acceptSubmission?: boolean;
  acceptAuction?: boolean;
  auctionStartPrice?: number;
  auctionStepPrice?: number;
  auctionReservePrice?: number;
  acceptImmediatePurchase?: boolean;
  immediatePurchasePrice?: number;
  groupId?: number;
  comment?: string;
  frevo?: number;
  b2cMarketValue?: number;
  standardMileage?: number;
  dpaProAmt?: number;
  salesSpeedName?: string;
  marketLink?: string;
  marketDataDate?: Date;
}
