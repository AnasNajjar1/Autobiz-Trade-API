import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace VehicleSaleImportErrors {
  export class VehicleWithSameFileNumberAlreadyExistsError extends Result<UseCaseError> {
    constructor(index: number, fileNumber: string) {
      super(false, {
        message: `row ${index}: Vehicle fileNumber ${fileNumber} already exists`,
      } as UseCaseError);
    }
  }

  export class VehicleWithSameRegistrationAlreadyExistsError extends Result<UseCaseError> {
    constructor(index: number, registration: string) {
      super(false, {
        message: `row ${index}: Vehicle registration ${registration} already exists`,
      } as UseCaseError);
    }
  }

  export class VehicleNotRecognized extends Result<UseCaseError> {
    constructor(index) {
      super(false, {
        message: `row ${index}: Vehicle is not recognized wrong registration/vin`,
      } as UseCaseError);
    }
  }

  export class FirstRegistrationDateNotValid extends Result<UseCaseError> {
    constructor(index: number) {
      super(false, {
        message: `row ${index}: First Registration Date is not valid`,
      } as UseCaseError);
    }
  }

  export class ImportSaleFailed extends Result<UseCaseError> {
    constructor(index: number, vehicleId: number, params: any) {
      super(false, {
        message: `row ${index}: Vehicle created id: ${vehicleId} and sale not created: ${params} is required`,
      } as UseCaseError);
    }
  }

  export class GroupNotFound extends Result<UseCaseError> {
    constructor(index: number, vehicleId: number, groupId: number) {
      super(false, {
        message: `row ${index}: Vehicle created id: ${vehicleId} and group ${groupId} not found`,
      } as UseCaseError);
    }
  }
  export class UnexpectedError extends Result<UseCaseError> {
    constructor(index: number, message?: string, vehicleId?: number) {
      super(false, {
        message: `row ${index}: ${
          vehicleId ? `Vehicle Created id: ${vehicleId}` : ''
        } ${message ? message : 'An unexpected error occurred'}`,
      } as UseCaseError);
    }
  }
}
