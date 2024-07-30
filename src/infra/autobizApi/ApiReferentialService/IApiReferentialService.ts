import { BaseApi } from '../../../core/infra/BaseApi';
import { left, Result, Either, right } from '../../../core/logic/Result';
export interface IApiReferentialService {
  getMakes(): Promise<ApiResponse<[]>>;
  getModels(makeId: number): Promise<ApiResponse<[]>>;
  getMonths(makeId: number, modelId: number): Promise<ApiResponse<[]>>;
  getYears(makeId: number, modelId: number): Promise<ApiResponse<[]>>;
  getFuels(makeId: number, modelId: number): Promise<ApiResponse<[]>>;
  getBodies(makeId: number, modelId: number): Promise<ApiResponse<[]>>;
  getGears(makeId: number, modelId: number): Promise<ApiResponse<[]>>;
  getDoors(makeId: number, modelId: number): Promise<ApiResponse<[]>>;
  getVersions(makeId: number, modelId: number): Promise<ApiResponse<[]>>;
  getFiscals(makeId: number, modelId: number): Promise<ApiResponse<[]>>;
  getEngines(makeId: number, modelId: number): Promise<ApiResponse<[]>>;
  getColors(makeId: number, modelId: number): Promise<ApiResponse<[]>>;
  getRegistrationDetails(
    registration: string,
    country: CountryReferential,
  ): Promise<ApiResponse<CarDetails>>;
  getVinDetails(
    vin: string,
    country: CountryReferential,
  ): Promise<ApiResponse<CarDetails>>;
}

type ApiErrorMessage = string;
export type ApiResponse<T> = Either<ApiErrorMessage, Result<T>>;
interface Version {
  id: number;
  name: string;
  finish: string;
  type: string;
}
export interface CarDetails {
  status: Boolean;
  registration: string;
  vin: string;
  typeMine: string;
  engineCode: string;
  makeId: number;
  makeName: string;
  modelId: number;
  modelName: string;
  bodyId: number;
  bodyName: string;
  fuelId: number;
  fuelName: string;
  gearboxId: number;
  gearboxName: string;
  doors: number;
  seats: number;
  kw: number;
  engine: number;
  fiscal: number;
  liter: number;
  cylinder: number;
  speedNumber: number;
  co2Emissions: number;
  tyreDimension: string[];
  dpf: Boolean;
  d4w: Boolean;
  color: string;
  propulsion: Boolean;
  height: number;
  width: number;
  length: number;
  emptyWeight: number;
  wheelbase: number;
  dateProduction?: string;
  dateGrayCard: string;
  vehicleGrayCardCode: string;
  vehicleType: {
    id: number;
    code: string;
    name: string;
  };
  versions: Version[];
  alerts: string[];
  warnings: string[];
  errors: string[];
  dateRelease: string;
}
export type CountryReferential = 'ES' | 'FR' | 'IT' | 'NL' | 'PT' | 'UK';
