import { BaseApi } from '../../core/infra/BaseApi';
import { left, Result, Either, right } from '../../core/logic/Result';

type ApiErrorMessage = string;
export type ApiResponse<T> = Either<ApiErrorMessage, Result<T>>;

export interface IApiCarcheckService {
  searchRecords(filter: {}): Promise<ApiResponse<[]>>;
  getRecordDetail(recordId: number): Promise<ApiResponse<[]>>;
  getSource(recordId: number): Promise<ApiResponse<[]>>;
}

export class ApiCarcheckService extends BaseApi implements IApiCarcheckService {
  constructor() {
    super(process.env.carcheckApiPath, process.env.autobizApiSecretKey);
  }

  async searchRecords(filter): Promise<ApiResponse<[]>> {
    const queryString = Object.keys(filter)
      .map((key) => key + '=' + filter[key])
      .join('&');

    try {
      const response = await this.get(
        `/buyer/record/search?searchMode=full&${queryString}`,
      );

      let list = response.data;

      if (!Array.isArray(list)) list = [list];

      list = list.map((item) => {
        item.id = item.recordId;
        return item;
      });

      return right(Result.ok<[]>(list));
    } catch (error) {
      return left(error ? error.message : 'Get Carcheck record list failed');
    }
  }

  async getRecordDetail(recordId: number): Promise<ApiResponse<any>> {
    try {
      const response = await this.get(`/buyer/record/${recordId}/details`);

      return right(Result.ok<any>(response.data));
    } catch (error) {
      return left(error ? error.message : 'Get Carcheck record detail failed');
    }
  }

  async getSource(sourceId: number): Promise<ApiResponse<any>> {
    try {
      const response = await this.get(`/sources/${sourceId}`);

      const { source } = response.data;

      return right(Result.ok<any>(source));
    } catch (error) {
      return left(error ? error.message : 'Get Carcheck source failed ');
    }
  }

  async getInspection(formId: number): Promise<ApiResponse<any>> {
    try {
      const response = await this.get(`/inspection/records/${formId}`);

      return right(Result.ok<any>(response.data));
    } catch (error) {
      return left(error ? error.message : 'Get Carcheck inspection failed ');
    }
  }
}
