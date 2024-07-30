export interface RepoPagination<T> {
  limit: number;
  offset: number;
  rows: T[];
  count: number;
}
