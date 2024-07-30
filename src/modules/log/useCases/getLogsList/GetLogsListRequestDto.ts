export interface GetLogsListRequestDto {
  limit: number;
  offset: number;
  sortBy: string;
  sortOrder: string;
  filter: {
    referenceTable: string;
    referenceId: number;
    action: string;
  };
}
