import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { Result } from '../../../../../core/logic/Result';

export namespace DeleteVehicleErrors {
  export class VehicleNotFoundError extends Result<UseCaseError> {
    constructor(id: number) {
      super(false, {
        message: `Couldn't find vehicle id ${id}`,
      } as UseCaseError);
    }
  }
}
