import { Sale } from '../domain/sale';

export interface ISaleRepo {
  save(sale: Sale): Promise<number>;
  getAdminSalesList(searchQuery?: any): Promise<any>;
  getOnlineSalesList(searchQuery?: any): Promise<any>;
  getBookmarkedSales(searchQuery?: any): Promise<any>;
  getBookmarkedPointofsalesSales(searchQuery?: any): Promise<any>;
  getPurchasedSales(searchQuery?: any): Promise<any>;
  getUserOffersSales(searchQuery?: any): Promise<any>;
  getSaleByUuid(uuid: string, userId: string): Promise<any>;
  getSaleInfo(uuid: string, userId: string): Promise<any>;
  getBrandModelFilter(userId: string): Promise<any>;
  getSaleById(id: number): Promise<Sale>;
  getSaleByIdWithOffers(id: number): Promise<Sale>;
  delete(saleId: number, user: string): Promise<void>;
  hasValidatedSiblingsSales(
    vehicleId: number,
    saleId?: number,
  ): Promise<boolean>;
  getOnlineInStockSales(): Promise<any>;
  getSalesJustEnded(interval: [string, string]): Promise<number[]>;
}
