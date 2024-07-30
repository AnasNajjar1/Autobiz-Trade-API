export interface CreateSaleRequestDto {
  validationStatus: string;
  supplyType: string;
  acceptAuction: boolean;
  acceptImmediatePurchase: boolean;
  acceptSubmission: boolean;
  auctionStartPrice: number;
  auctionStepPrice: number;
  auctionReservePrice: number;
  immediatePurchasePrice: number;
  startDateTime: Date;
  endDateTime: Date;
  comment: string;
  vehicleId: number;
  ownerId?: number;
  groupId?: number;
  listId?: number;
  carcheckId?: number;
  expressSale?: boolean;
  createdBy: string;
}
