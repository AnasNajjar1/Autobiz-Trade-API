import { BaseApi } from '../../../core/infra/BaseApi';
import { left, Result, Either, right } from '../../../core/logic/Result';
import {
  IApiReferentialService,
  ApiResponse,
  CountryReferential,
  CarDetails,
} from './IApiReferentialService';

export class ApiReferentialService
  extends BaseApi
  implements IApiReferentialService {
  constructor() {
    super(
      process.env.autobizApiPath + '/referential/v1/',
      process.env.autobizApiSecretKey,
    );
  }

  async getMakes(): Promise<ApiResponse<[]>> {
    try {
      const response = await this.get('makes');
      return right(Result.ok<[]>(response.data));
    } catch (error) {
      return left(error ? error.message : 'Connection failed');
    }
  }

  async getModels(makeId: number): Promise<ApiResponse<[]>> {
    try {
      const response = await this.get(`/make/${makeId}/models`);
      return right(
        Result.ok<[]>(
          Array.isArray(response.data) ? response.data : [response.data],
        ),
      );
    } catch (error) {
      return left(error ? error.message : 'Connection failed');
    }
  }

  async getMonths(makeId: number, modelId: number): Promise<ApiResponse<[]>> {
    try {
      const response = await this.get(
        `/make/${makeId}/model/${modelId}/months`,
      );
      return right(
        Result.ok<[]>(
          Array.isArray(response.data) ? response.data : [response.data],
        ),
      );
    } catch (error) {
      return left(error ? error.message : 'Connection failed');
    }
  }

  async getYears(makeId: number, modelId: number): Promise<ApiResponse<[]>> {
    try {
      const response = await this.get(`/make/${makeId}/model/${modelId}/years`);
      return right(
        Result.ok<[]>(
          Array.isArray(response.data) ? response.data : [response.data],
        ),
      );
    } catch (error) {
      return left(error ? error.message : 'Connection failed');
    }
  }

  async getFuels(makeId: number, modelId: number): Promise<ApiResponse<[]>> {
    try {
      const response = await this.get(`/make/${makeId}/model/${modelId}/fuels`);
      return right(
        Result.ok<[]>(
          Array.isArray(response.data) ? response.data : [response.data],
        ),
      );
    } catch (error) {
      return left(error ? error.message : 'Connection failed');
    }
  }

  async getBodies(makeId: number, modelId: number): Promise<ApiResponse<[]>> {
    try {
      const response = await this.get(
        `/make/${makeId}/model/${modelId}/bodies`,
      );
      return right(
        Result.ok<[]>(
          Array.isArray(response.data) ? response.data : [response.data],
        ),
      );
    } catch (error) {
      return left(error ? error.message : 'Connection failed');
    }
  }

  async getGears(makeId: number, modelId: number): Promise<ApiResponse<[]>> {
    try {
      const response = await this.get(`/make/${makeId}/model/${modelId}/gears`);
      return right(
        Result.ok<[]>(
          Array.isArray(response.data) ? response.data : [response.data],
        ),
      );
    } catch (error) {
      return left(error ? error.message : 'Connection failed');
    }
  }

  async getDoors(makeId: number, modelId: number): Promise<ApiResponse<[]>> {
    try {
      const response = await this.get(`/make/${makeId}/model/${modelId}/doors`);
      return right(
        Result.ok<[]>(
          Array.isArray(response.data) ? response.data : [response.data],
        ),
      );
    } catch (error) {
      return left(error ? error.message : 'Connection failed');
    }
  }

  async getFiscals(makeId: number, modelId: number): Promise<ApiResponse<[]>> {
    try {
      const response = await this.get(
        `/make/${makeId}/model/${modelId}/fiscals`,
      );
      return right(
        Result.ok<[]>(
          Array.isArray(response.data) ? response.data : [response.data],
        ),
      );
    } catch (error) {
      return left(error ? error.message : 'Connection failed');
    }
  }

  async getEngines(makeId: number, modelId: number): Promise<ApiResponse<[]>> {
    try {
      const response = await this.get(
        `/make/${makeId}/model/${modelId}/engines`,
      );
      return right(
        Result.ok<[]>(
          Array.isArray(response.data) ? response.data : [response.data],
        ),
      );
    } catch (error) {
      return left(error ? error.message : 'Connection failed');
    }
  }

  async getVersions(makeId: number, modelId: number): Promise<ApiResponse<[]>> {
    try {
      const response = await this.get(
        `/make/${makeId}/model/${modelId}/versions`,
      );
      return right(
        Result.ok<[]>(
          Array.isArray(response.data) ? response.data : [response.data],
        ),
      );
    } catch (error) {
      return left(error ? error.message : 'Connection failed');
    }
  }

  async getColors(makeId: number, modelId: number): Promise<ApiResponse<[]>> {
    try {
      const response = await this.get(
        `/make/${makeId}/model/${modelId}/colors`,
      );
      return right(
        Result.ok<[]>(
          Array.isArray(response.data) ? response.data : [response.data],
        ),
      );
    } catch (error) {
      return left(error ? error.message : 'Connection failed');
    }
  }
  async getRegistrationDetails(
    registration: string,
    country: CountryReferential,
  ): Promise<ApiResponse<CarDetails>> {
    try {
      const { data } = await this.get(
        `/car-details/registration/${registration}/${country}?language=en`,
      );
      if (!data.makeName || !data.modelName) {
        throw new Error('registration plate not recognized');
      }
      return right(Result.ok<CarDetails>(data));
    } catch (error) {
      return left(error ? error.message : 'Connection failed');
    }
  }
  async getVinDetails(
    vin: string,
    country: CountryReferential,
  ): Promise<ApiResponse<CarDetails>> {
    try {
      const response = await this.get(
        `/car-details/vin/${vin}/dat/${country}?language=en`,
      );
      return right(Result.ok<CarDetails>(response.data));
    } catch (error) {
      return left(error ? error.message : 'Connection failed');
    }
  }
}
