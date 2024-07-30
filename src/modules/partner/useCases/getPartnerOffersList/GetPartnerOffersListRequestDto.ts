export interface GetPartnerOffersListRequestDto {
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: string;
  filter: {
    id: number | number[];
    value: number;
    partnerRequestId: number;
  };
}
