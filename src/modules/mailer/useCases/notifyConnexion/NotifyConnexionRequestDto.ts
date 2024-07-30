import { SaleNotificationDto } from '../../../catalog/dtos/saleDto';

export interface Request {
  userId: string;
  sales: SaleNotificationDto[];
}
