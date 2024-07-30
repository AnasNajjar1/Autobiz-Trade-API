export interface GetPartnerRequestsListRequestDto {
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: string;
  filter: {
    id: number | number[];
    vehicleId: number;
    partnerId: number;
    statusId: number;
    fileNumber: string;
    registrationLike: string;
    createdBy: string;
    pointOfSaleId: string;
  };
}
