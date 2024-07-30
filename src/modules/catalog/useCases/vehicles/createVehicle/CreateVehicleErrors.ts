import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { Result } from '../../../../../core/logic/Result';

export namespace CreateVehicleErrors {
  export class VehicleWithSameFileNumberAlreadyExistsError extends Result<UseCaseError> {
    constructor(fileNumber: string) {
      super(false, {
        message: `Vehicle fileNumber ${fileNumber} already exists`,
      } as UseCaseError);
    }
  }

  export class VehicleWithSameRegistrationAlreadyExistsError extends Result<UseCaseError> {
    constructor(registration: string) {
      super(false, {
        message: `Vehicle registration ${registration} already exists`,
      } as UseCaseError);
    }
  }
}
