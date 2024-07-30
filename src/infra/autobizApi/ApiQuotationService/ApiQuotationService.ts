import { Bool } from 'aws-sdk/clients/clouddirectory';
import { BaseApi } from '../../../core/infra/BaseApi';
import { left, Result, Either, right } from '../../../core/logic/Result';

type ApiErrorMessage = string;
export type ApiResponse<T> = Either<ApiErrorMessage, Result<T>>;

export type QuotationInfosDto = {
  status: Boolean;
  profile?: string;
  standardMileage?: number;
  minStandardMileage?: number;
  maxStandardMileage?: number;
  refurbishmentCost?: number;
  _quotation?: {
    b2cMarketValue?: number;
    network?: number;
    particular?: number;
    tradeIn?: number;
    mcclbp?: number;
    median?: number;
    autobiz?: number;
    internet?: number;
    corrected?: number;
    bid?: number;
  };
  _marketInformation?: {
    timeToSell?: number;
    transactionSpread?: number;
    lastTransactions?: number;
    observationPeriod?: number;
    nbrAdsOfParticular?: number;
    nbrAdsOfNetwork?: number;
    nbrAdsOfOtherPro?: number;
  };
  _salesSpeed?: {
    id?: number;
    name?: string;
    rotation?: number;
  };
  _links?: {
    marketQuotation?: string;
    marketAnalysis?: string;
  };
  _error?: Array<any>;
};

export interface IApiQuotationService {
  getQuotationByVersion(filter: {}): Promise<ApiResponse<QuotationInfosDto>>;
  getQuotationByReference(filter: {}): Promise<ApiResponse<QuotationInfosDto>>;
}

export class ApiQuotationService
  extends BaseApi
  implements IApiQuotationService {
  constructor() {
    super(process.env.autobizApiPath, process.env.autobizApiSecretKey);
  }

  async getQuotationByVersion(filter): Promise<ApiResponse<QuotationInfosDto>> {
    const pathParams = Object.keys(filter.pathParams)
      .map((key) => key + '/' + filter.pathParams[key])
      .join('/');

    const queryParams = Object.keys(filter.queryParams)
      .map((key) => key + '=' + filter.queryParams[key])
      .join('&');

    try {
      const response = await this.get(
        `/quotation/v1/${pathParams}/quotation?${queryParams}`,
      );
      return right(Result.ok<QuotationInfosDto>(response.data));
    } catch (error) {
      return left(error ? error.message : 'Get Quotation by version failed');
    }
  }

  async getQuotationByReference(
    filter,
  ): Promise<ApiResponse<QuotationInfosDto>> {
    const queryString = Object.keys(filter)
      .map((key) => key + '=' + filter[key])
      .join('&');

    try {
      const response = await this.get(`/quotation/v1/quotation?${queryString}`);
      return right(Result.ok<QuotationInfosDto>(response.data));
    } catch (error) {
      return left(error ? error.message : 'Get Quotation by reference failed');
    }
  }
}
