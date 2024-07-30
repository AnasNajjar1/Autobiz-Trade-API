import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { GetAdminVehiclesRequestDto } from './GetAdminVehiclesRequestDto';
import { IVehicleRepo } from '../../../repos/vehicleRepo';
import { Vehicle } from '../../../domain/vehicle';

interface PaginatedVehicle {
  count: number;
  limit: number;
  offset: number;
  rows: Vehicle[];
}

type Response = Either<AppError.UnexpectedError, Result<PaginatedVehicle>>;

export class GetAdminVehiclesUseCase
  implements UseCase<GetAdminVehiclesRequestDto, Promise<Response>> {
  private vehicleRepo: IVehicleRepo;

  constructor(vehicleRepo: IVehicleRepo) {
    this.vehicleRepo = vehicleRepo;
  }

  public async execute(request: GetAdminVehiclesRequestDto): Promise<Response> {
    try {
      const paginatedVehicles = await this.vehicleRepo.getAdminVehiclesList(
        request,
      );

      return right(Result.ok<PaginatedVehicle>(paginatedVehicles));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
