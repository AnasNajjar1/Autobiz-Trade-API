import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { IVehicleRepo } from '../../../repos/vehicleRepo';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { CreateVehicleRequestDto } from '../createVehicle/CreateVehicleRequestDto';
import { createVehicleUseCase } from '../createVehicle';

type Response = Either<AppError.UnexpectedError | Result<any>, Result<number>>;

export class FindOrCreateVehicleUseCase
  implements UseCase<CreateVehicleRequestDto, Promise<Response>> {
  private vehicleRepo: IVehicleRepo;

  constructor(vehicleRepo: IVehicleRepo) {
    this.vehicleRepo = vehicleRepo;
  }

  public async execute(dto: CreateVehicleRequestDto): Promise<any> {
    const vehicle = await this.vehicleRepo.getAdminVehicleByRegistration(
      dto.registration,
    );

    //vehicle found
    if (vehicle) {
      return right(Result.ok<number>(vehicle.id));
    }

    try {
      const vehicleId = await createVehicleUseCase.execute(dto);

      return right(Result.ok<number>(vehicleId.value.getValue()));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
