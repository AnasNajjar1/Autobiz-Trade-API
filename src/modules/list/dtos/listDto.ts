import { SaleAdminDto } from '../../catalog/dtos/saleDto';

export interface ListAdminDto {
  id: number;
  uuid: string;
  name: string;
  picture: string;
  startDateTime: Date;
  endDateTime: Date;
  groupId: number;
  sales?: SaleAdminDto[];
}

export interface ListPublicDto {
  id: number;
  uuid: string;
  name: string;
  picture: string;
  startDateTime: Date;
  endDateTime: Date;
  sales?: any[];
  vehicles?: any[];
}
