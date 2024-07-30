export interface LogDto {
  id: number;
  referenceTable: string;
  referenceId: number;
  data: string;
  user: string;
  action: string;
  createdAt: Date;
}
