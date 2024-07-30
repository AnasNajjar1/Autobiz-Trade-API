import { left, Result, Either, right } from '../../../core/logic/Result';
import {
  IApiQuotationService,
  ApiResponse,
  QuotationInfosDto,
} from './ApiQuotationService';

export class InMemoryApiQuotationService implements IApiQuotationService {
  constructor() {}

  async getQuotationByVersion(filter: {
    pathParams: {
      version: 1;
      year: 2000;
      mileage: 5000;
    };
    queryParams: {
      month: 11;
      country: 'FR';
    };
  }): Promise<ApiResponse<QuotationInfosDto>> {
    return filter.pathParams.version === null
      ? left('Get Quotation by version failed')
      : right(
          Result.ok<QuotationInfosDto>({
            status: false,
            profile: 'test',
            standardMileage: 1,
            minStandardMileage: 1,
            maxStandardMileage: 1,
            refurbishmentCost: 1,
            _quotation: {
              b2cMarketValue: 0,
              network: 0,
              particular: 0,
              tradeIn: 0,
              mcclbp: 0,
              median: 0,
              autobiz: 0,
              internet: 0,
              corrected: 0,
              bid: 0,
            },
            _marketInformation: {
              timeToSell: 0,
              transactionSpread: 0,
              lastTransactions: 0,
              observationPeriod: 0,
              nbrAdsOfParticular: 0,
              nbrAdsOfNetwork: 0,
              nbrAdsOfOtherPro: 0,
            },
            _salesSpeed: {
              id: 9,
              name: 'test',
              rotation: 0,
            },
            _links: {
              marketQuotation: 'test',
              marketAnalysis: 'test',
            },
            _error: [
              {
                code: 1,
                message: 'test',
              },
            ],
          }),
        );
  }

  async getQuotationByReference(filter: {
    makeId: 1;
    modelId: 1;
    fuelId: 1;
    gearId: 1;
    engine: 15;
    year: 2020;
    mileage: 5000;
    bodyId: 1;
    doors: 5;
    country: 'FR';
  }): Promise<ApiResponse<QuotationInfosDto>> {
    return filter.mileage === null
      ? left('Get Quotation by reference failed')
      : right(
          Result.ok<QuotationInfosDto>({
            status: false,
            profile: 'test',
            standardMileage: 1,
            minStandardMileage: 1,
            maxStandardMileage: 1,
            refurbishmentCost: 1,
            _quotation: {
              b2cMarketValue: 0,
              network: 0,
              particular: 0,
              tradeIn: 0,
              mcclbp: 0,
              median: 0,
              autobiz: 0,
              internet: 0,
              corrected: 0,
              bid: 0,
            },
            _marketInformation: {
              timeToSell: 0,
              transactionSpread: 0,
              lastTransactions: 0,
              observationPeriod: 0,
              nbrAdsOfParticular: 0,
              nbrAdsOfNetwork: 0,
              nbrAdsOfOtherPro: 0,
            },
            _salesSpeed: {
              id: 9,
              name: 'test',
              rotation: 0,
            },
            _links: {
              marketQuotation: 'test',
              marketAnalysis: 'test',
            },
            _error: [
              {
                code: 1,
                message: 'test',
              },
            ],
          }),
        );
  }
}
