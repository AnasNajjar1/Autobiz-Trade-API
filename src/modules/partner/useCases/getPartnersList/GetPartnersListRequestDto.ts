export interface GetPartnersListRequestDto {
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: string;
  filter: {
    id: number | number[];
    name: string;
  };
}
