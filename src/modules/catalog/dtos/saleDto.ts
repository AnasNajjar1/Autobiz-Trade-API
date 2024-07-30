import { VehicleAdminShortDto, VehiclePublicFullDto } from './vehicleDto';
import { VehiclePublicShortDto } from './vehicleDto';
import { VehicleFileNumber } from '../domain/vehicleFileNumber';
import { OffersEnOfSaleNotificationDto } from './offerDto';
import { GroupDto } from '../../group/dtos/groupDto';
import { IbestOffererDetails } from '../domain/bestOffererDetails';

export interface SalePublicFullDto {
  uuid: string;
  supplyType: string;
  status: string;
  acceptAuction: boolean;
  acceptImmediatePurchase: boolean;
  acceptSubmission: boolean;
  auctionStartPrice: number;
  auctionStepPrice: number;
  immediatePurchasePrice: number;
  auctionReservePrice?: number;
  startDateTime: Date;
  endDateTime: Date;
  vehicle?: VehiclePublicFullDto;
  comment: string;
  commentInt: string;
  createdAt?: Date;
  countOffers?: number;
  countAuctions?: number;
  minimalAuction?: number;
  bestAuction?: number;
  bestOfferType?: string;
  bestOfferer?: string;
  winner?: string;
  secondsBeforeEnd: number;
  url?: string;
  isBookmarkedByUser: boolean;
}

export interface SaleInfosDto {
  uuid: string;
  supplyType: string;
  status: string;
  auctionStartPrice: number;
  auctionStepPrice: number;
  immediatePurchasePrice: number;
  auctionReservePrice: number;
  auctionReservePriceIsReached: boolean;
  endDateTime: Date;
  countOffers?: number;
  countAuctions?: number;
  minimalAuction: number;
  bestAuction?: number;
  bestOfferType?: string;
  bestOffer: number;
  bestOfferer?: string;
  secondsBeforeStart: number;
  secondsBeforeEnd: number;
  isSubmissionOpen: boolean;
  isAuctionOpen: boolean;
  isImmediatePurchaseOpen: boolean;
  isSold: boolean;
  userInfo: any;
  isOwner: boolean;
}

export interface SalePublicShortDto {
  uuid: string;
  supplyType: string;
  status: string;
  acceptAuction: boolean;
  acceptImmediatePurchase: boolean;
  acceptSubmission: boolean;
  auctionStartPrice: number;
  auctionStepPrice: number;
  immediatePurchasePrice: number;
  auctionReservePrice?: number;
  startDateTime: Date;
  endDateTime: Date;
  vehicle?: VehiclePublicShortDto;
  comment: string;
  commentInt: string;
  createdAt?: Date;
  countOffers?: number;
  countAuctions?: number;
  minimalAuction?: number;
  bestAuction?: number;
  bestOfferType?: string;
  bestOfferer?: string;
  winner?: string;
  secondsBeforeStart: number;
  secondsBeforeEnd: number;
  url: string;
  isBookmarkedByUser: boolean;
  isSold: boolean;
  userInfo: any;
}

export interface SaleAdminDto {
  id: number;
  uuid: string;
  validationStatus: string;
  supplyType: string;
  acceptAuction: boolean;
  acceptImmediatePurchase: boolean;
  acceptSubmission: boolean;
  countAuctions: number;
  auctionStartPrice: number;
  auctionStepPrice: number;
  auctionReservePrice: number;
  immediatePurchasePrice: number;
  startDateTime: Date;
  endDateTime: Date;
  status: string;
  url: string;
  createdBy: string;
  vehicle: VehicleAdminShortDto;
  vehicleId: Number;
  comment: string;
  commentInt: string;
  listId: number;
  carcheckId: number;
  expressSale: boolean;
  groupId: number;
  ownerId: number;
  countOffers: number;
  requestWinner: boolean;
  deleteWinner: boolean;
  winner: string;
  bestOfferer: String;
  group?: GroupDto;
  bestOffer?: any;
  bestOfferType?: string;
  bestOffererDetails?: IbestOffererDetails;
}

export interface SaleNotificationDto {
  fileNumber: string;
  brandLabel: string;
  modelLabel: string;
  versionLabel: string;
  mileage: number;
  pointofsaleName: string;
  uuid: string;
  carPicture?: string;
}

export interface EndOfSaleNotificationDto {
  fileNumber: string;
  brandLabel: string;
  modelLabel: string;
  versionLabel: string;
  mileage: number;
  city: string;
  paymentDeadline: string;
  pickupDeadline: string;
  comments: string;
  uuid: string;
  pdfReport: string;
  winner: string;
  firstRegistrationDateYear?: number;
  offers: OffersEnOfSaleNotificationDto[];
  offerAmount?: number;
  offerCreatedAt?: string;
  link?: string;
}

export interface AssignedWinnerSaleNotificationDto {
  fileNumber: string;
  brandLabel: string;
  modelLabel: string;
  versionLabel: string;
  mileage: number;
  uuid: string;
  winner: string;
  supplyType: string;
  POS_name?: string;
  POS_zipCode?: string;
  POS_city?: string;
  city?: string;
  offerAmount?: number;
  offerCreatedAt?: string;
  entryStockDate?: string;
  link?: string;
  pdfReport?: string;
  firstRegistrationDateYear?: number;
  offers?: OffersEnOfSaleNotificationDto[];
  paymentDeadline?: string;
  pickupDeadline?: string;
  comments?: string;
}
