import { BaseApi } from '../../../core/infra/BaseApi';
import { left, Result, Either, right } from '../../../core/logic/Result';
import {
  IApiReferentialService,
  ApiResponse,
  CountryReferential,
  CarDetails,
} from './IApiReferentialService';

export class InMemoryApiReferentialService implements IApiReferentialService {
  constructor() {}

  async getMakes(): Promise<ApiResponse<[]>> {}

  async getModels(makeId: number): Promise<ApiResponse<[]>> {}

  async getMonths(makeId: number, modelId: number): Promise<ApiResponse<[]>> {}

  async getYears(makeId: number, modelId: number): Promise<ApiResponse<[]>> {}

  async getFuels(makeId: number, modelId: number): Promise<ApiResponse<[]>> {}

  async getBodies(makeId: number, modelId: number): Promise<ApiResponse<[]>> {}

  async getGears(makeId: number, modelId: number): Promise<ApiResponse<[]>> {}

  async getDoors(makeId: number, modelId: number): Promise<ApiResponse<[]>> {}

  async getFiscals(makeId: number, modelId: number): Promise<ApiResponse<[]>> {}

  async getEngines(makeId: number, modelId: number): Promise<ApiResponse<[]>> {}

  async getVersions(
    makeId: number,
    modelId: number,
  ): Promise<ApiResponse<[]>> {}

  async getColors(makeId: number, modelId: number): Promise<ApiResponse<[]>> {}

  async getRegistrationDetails(
    registration: string,
    country: CountryReferential,
  ): Promise<ApiResponse<CarDetails>> {
    return registration !== 'DM-392-KB'
      ? left('rong registration')
      : right(
          Result.ok<CarDetails>({
            status: true,
            doors: 5,
            seats: 5,
            kw: 117,
            fuelName: 'DIESEL',
            gearboxName: 'MANUAL',
            makeName: 'FORD',
            modelName: 'FOCUS C-MAX',
            dateGrayCard: '2014-12-09',
            dateRelease: '2014-12-09',
          }),
        );
  }
  async getVinDetails(
    vin: string,
    country: CountryReferential,
  ): Promise<ApiResponse<CarDetails>> {
    return right(
      Result.ok<CarDetails>({
        doors: 5,
        seats: 5,
        kw: 117,
        fuelName: 'DIESEL',
        gearboxName: 'MANUAL',
        makeName: 'FORD',
        modelName: 'FOCUS C-MAX',
        dateGrayCard: '2014-12-09',
        dateRelease: '2014-12-09',
      }),
    );
  }
}
