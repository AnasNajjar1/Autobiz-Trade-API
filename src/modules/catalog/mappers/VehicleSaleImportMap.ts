import { VehicleSaleImportDto } from '../useCases/vehicleSaleImport/VehicleSaleImportRequestDto';
import _ from 'lodash';
import moment from 'moment';

export class VehicleSaleImportMap {
  public static excelToVehicleSale(
    headers: string[],
    row: any[],
  ): VehicleSaleImportDto {
    return {
      createVehicle:
        row[headers.indexOf('createVehicle')] === 'true' ? true : false,
      vinAnalysis: row[headers.indexOf('vinAnalysis')],
      country: row[headers.indexOf('country')],
      vin: row[headers.indexOf('vin')],
      registration: row[headers.indexOf('registration')],
      versionLabel: row[headers.indexOf('versionLabel')],
      mileage: row[headers.indexOf('mileage')],
      firstRegistrationDate: row[headers.indexOf('firstRegistrationDate')]
        ? row[headers.indexOf('firstRegistrationDate')]
        : null,
      vat: row[headers.indexOf('vat')],
      pointOfSaleId: row[headers.indexOf('pointOfSaleId')],
      color: row[headers.indexOf('color')]
        ? row[headers.indexOf('color')]
        : null,
      door: row[headers.indexOf('door')] ? row[headers.indexOf('door')] : null,
      seats: row[headers.indexOf('seats')]
        ? row[headers.indexOf('seats')]
        : null,
      kw: row[headers.indexOf('kw')] ? row[headers.indexOf('kw')] : null,
      fuelLabel: row[headers.indexOf('fuelLabel')]
        ? row[headers.indexOf('fuelLabel')]
        : null,
      gearBoxLabel: row[headers.indexOf('gearBoxLabel')]
        ? row[headers.indexOf('gearBoxLabel')]
        : null,
      vehicleType: row[headers.indexOf('vehicleType')]
        ? row[headers.indexOf('vehicleType')]
        : null,
      imported: row[headers.indexOf('imported')]
        ? row[headers.indexOf('imported')]
        : null,
      cgDate: row[headers.indexOf('cgDate')]
        ? row[headers.indexOf('cgDate')]
        : null,
      nextTechnicalCheckDate: row[headers.indexOf('nextTechnicalCheckDate')]
        ? moment(row[headers.indexOf('nextTechnicalCheckDate')]).format('YYYY-MM')
        : null,
      lastServicingDate: row[headers.indexOf('lastServicingDate')]
        ? moment(row[headers.indexOf('lastServicingDate')]).format('YYYY-MM')
        : null,
      lastServicingKm: row[headers.indexOf('lastServicingKm')]
        ? row[headers.indexOf('lastServicingKm')]
        : null,
      servicingHistory: row[headers.indexOf('servicingHistory')]
        ? row[headers.indexOf('servicingHistory')]
        : null,
      frevo: row[headers.indexOf('frevo')]
        ? row[headers.indexOf('frevo')]
        : null,
      gcDate: row[headers.indexOf('gcDate')]
        ? row[headers.indexOf('gcDate')]
        : null,
      createSale: row[headers.indexOf('createSale')] === 'true' ? true : false,
      startDateTime: row[headers.indexOf('startDateTime')]
        ? formatExcelDate(row[headers.indexOf('startDateTime')])
        : null,
      endDateTime: row[headers.indexOf('endDateTime')]
        ? formatExcelDate(row[headers.indexOf('endDateTime')])
        : null,
      acceptSubmission:
        row[headers.indexOf('acceptSubmission')] === 'true' ? true : false,
      acceptAuction:
        row[headers.indexOf('acceptAuction')] === 'true' ? true : false,
      auctionStartPrice:
        row[headers.indexOf('acceptAuction')] === 'true'
          ? row[headers.indexOf('auctionStartPrice')]
          : 0,
      auctionStepPrice:
        row[headers.indexOf('acceptAuction')] === 'true'
          ? row[headers.indexOf('auctionStepPrice')]
            ? row[headers.indexOf('auctionStepPrice')]
            : 100
          : 0,
      auctionReservePrice: row[headers.indexOf('auctionReservePrice')],
      acceptImmediatePurchase:
        row[headers.indexOf('acceptImmediatePurchase')] === 'true'
          ? true
          : false,
      immediatePurchasePrice:
        row[headers.indexOf('acceptImmediatePurchase')] === 'true'
          ? row[headers.indexOf('immediatePurchasePrice')]
          : 0,
      groupId: row[headers.indexOf('groupId')]
        ? row[headers.indexOf('groupId')]
        : null,
      comment: row[headers.indexOf('comment')]
        ? row[headers.indexOf('comment')]
        : null,
    };
  }
}

function formatExcelDate(date) {
  const formatedDate = _.map(date.richText, (d) => d.text).join('');
  if (formatedDate.length > 0) return formatedDate;
  return date;
}
