export interface GetAdminSalesRequestDto {
  userId: string;
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: string;
  filter: any;
}
