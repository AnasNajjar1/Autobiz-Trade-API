import { DeleteVehicleErrors } from './DeleteVehicleErrors';
import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { IVehicleRepo } from '../../../repos/vehicleRepo';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Vehicle } from '../../../domain/vehicle';

type Response = Either<
  DeleteVehicleErrors.VehicleNotFoundError | AppError.UnexpectedError,
  Result<Vehicle>
>;

interface Request {
  id: number;
  user: string;
}

export class DeleteVehicleUseCase
  implements UseCase<Request, Promise<Response>> {
  private vehicleRepo: IVehicleRepo;

  constructor(vehicleRepo: IVehicleRepo) {
    this.vehicleRepo = vehicleRepo;
  }

  public async execute(request: Request): Promise<any> {
    const vehicleId = Number(request.id);
    const user = request.user;

    try {
      await this.vehicleRepo.delete(vehicleId, user);

      return right(Result.ok<boolean>(true));
    } catch (err) {
      return left(
        new DeleteVehicleErrors.VehicleNotFoundError(vehicleId),
      ) as Response;
    }
  }
}
