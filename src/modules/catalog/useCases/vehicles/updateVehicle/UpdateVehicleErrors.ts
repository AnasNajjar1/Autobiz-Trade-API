import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { Result } from '../../../../../core/logic/Result';

export namespace UpdateVehicleErrors {
  export class VehicleNotFoundError extends Result<UseCaseError> {
    constructor(id: number) {
      super(false, `Couldn't find vehicle id ${id}`);
    }
  }
  export class VehicleWithSameFileNumberAlreadyExistsError extends Result<UseCaseError> {
    constructor(fileNumber: string) {
      super(false, `Vehicle fileNumber ${fileNumber} already exists`);
    }
  }

  export class VehicleWithSameRegistrationAlreadyExistsError extends Result<UseCaseError> {
    constructor(registration: string) {
      super(false, `Vehicle registration ${registration} already exists`);
    }
  }
}
