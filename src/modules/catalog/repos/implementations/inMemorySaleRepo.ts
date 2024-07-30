import { ISaleRepo } from '../saleRepo';
import { SaleMap } from '../../mappers/SaleMap';
import { Sale, SaleProps } from '../../domain/sale';
import { GetOnlineSalesRequestDto } from '../../useCases/sales/getOnlineSales/GetOnlineSalesRequestDto';
import moment from 'moment';

export class InMemorySaleRepo implements ISaleRepo {
  private mockedSales;

  public constructor(mock?: any) {
    this.mockedSales = mock ? mock : [];
  }

  public async getAdminSalesList() {}
  public async getOnlineSalesList() {}
  public async getUserOffersSales() {}
  public async getBrandModelFilter() {}
  public async getSaleInfo() {}
  public async hasValidatedSiblingsSales(vehicleId, saleId) {
    const validatedsaleFromSameVehicle = this.mockedSales.filter(
      (x) => x.vehicleId === vehicleId && x.validationStatus === 'VALIDATED',
    );
    if (validatedsaleFromSameVehicle.length === 0) {
      return false;
    }

    return true;
  }

  public async getPurchasedSales() {}

  public async getBookmarkedPointofsalesSales() {}

  public async getBookmarkedSales() {}

  public async getSaleList(request: GetOnlineSalesRequestDto): Promise<any> {
    const pagination = {
      rows: this.mockedSales.map((p) => SaleMap.toDomain(p)),
      count: this.mockedSales.length,
    };

    return pagination;
  }

  public async getSaleById(id: number): Promise<Sale> {
    const sale = this.mockedSales.find((x) => x.id === id);
    if (!!sale === false) throw new Error(`sale not found id : ${id}`);
    return SaleMap.toDomain(sale);
  }

  public async getSaleByIdWithOffers(id: number): Promise<Sale> {
    return this.getSaleById(id);
  }

  public async getSaleByUuid(uuid: string): Promise<Sale> {
    const sale = this.mockedSales.find((x) => x.uuid === uuid);
    if (!!sale === false) throw new Error('sale not found.');
    return SaleMap.toDomain(sale);
  }
  public async deleteSaleById(id: number): Promise<void> {
    const sale = this.mockedSales.find((x) => x.id === id);
    if (!!sale === false) throw new Error('sale not found.');

    this.mockedSales = this.mockedSales.filter((x) => x.id !== id);

    const found = this.mockedSales.find((x) => x.id === id);

    if (found) {
      throw new Error('Pointofsale not deleted.');
    } else {
      return;
    }
  }

  public async getSalesByVehicleId(vehicleId: number): Promise<Sale[]> {
    const sales = this.mockedSales.filter((x) => x.vehicleId === vehicleId);

    if (!!sales === false) throw new Error('sales not found.');
    return sales.map((p) => SaleMap.toDomain(p));
  }

  public async save(sale: Sale): Promise<number> {
    const rawSale: any = await SaleMap.toPersistence(sale);
    rawSale.id = 1;
    this.mockedSales.push(rawSale);
    return Promise.resolve(1);
  }

  public delete(saleId: number): Promise<void> {
    return;
  }

  public async getOnlineInStockSales() {
    const sales = this.mockedSales.filter(
      (x) =>
        x.validationStatus === 'VALIDATED' &&
        x.supplyType === 'STOCK' &&
        x.saleStats.status === 'LIVE',
    );
    return sales.map((p) => SaleMap.toDomain(p));
  }

  public async getSalesJustEnded(
    interval: [string, string],
  ): Promise<number[]> {
    const sales = this.mockedSales.filter(
      (x) =>
        x.validationStatus === 'VALIDATED' &&
        x.winner !== null &&
        x.assignedWinner === null &&
        moment(moment(x.endDateTime)).isBetween(
          moment(interval[0]),
          moment(interval[1]),
        ),
    );
    return sales.map((p) => p.id);
  }
}
