import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { GetAdminVehicleByIdRequestDto } from './GetAdminVehicleByIdRequestDto';
import { IVehicleRepo } from '../../../repos/vehicleRepo';
import { Vehicle } from '../../../domain/vehicle';
import { GetAdminVehicleByIdErrors } from './GetAdminVehicleByIdErrors';

type Response = Either<AppError.UnexpectedError, Result<Vehicle>>;

export class GetAdminVehicleByIdUseCase
  implements UseCase<GetAdminVehicleByIdRequestDto, Promise<Response>> {
  private vehicleRepo: IVehicleRepo;

  constructor(vehicleRepo: IVehicleRepo) {
    this.vehicleRepo = vehicleRepo;
  }

  public async execute(dto: GetAdminVehicleByIdRequestDto): Promise<Response> {
    try {
      const vehicle = await this.vehicleRepo.getAdminVehicleById(dto.id);

      return right(Result.ok<Vehicle>(vehicle));
    } catch (err) {
      return left(new GetAdminVehicleByIdErrors.VehicleNotFoundError(dto.id));
    }
  }
}
