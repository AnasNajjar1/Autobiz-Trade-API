import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace VehicleImageImportErrors {
  export class VehicleNotFoundError extends Result<UseCaseError> {
    constructor(registration: string) {
      super(false, {
        message: `can not find vehicle with registration ${registration}`,
      } as UseCaseError);
    }
  }

  export class UpdateVehicleFailed extends Result<UseCaseError> {
    constructor(registration: string) {
      super(false, {
        message: `can not update vehicule with registration: ${registration}`,
      } as UseCaseError);
    }
  }
  export class MaskPicturesFailed extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, {
        message: `${message} can not mask pictures `,
      } as UseCaseError);
    }
  }
  export class UnexpectedError extends Result<UseCaseError> {
    constructor(registration: string, message: any) {
      super(false, {
        message: `${message} where registration is : ${registration}`,
      } as UseCaseError);
    }
  }
}
