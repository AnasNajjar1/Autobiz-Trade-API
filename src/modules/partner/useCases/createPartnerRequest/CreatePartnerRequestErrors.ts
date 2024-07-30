import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace CreatePartnerRequestErrors {
  export class VehicleNotFoundExistsError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `vehicleId is not defined.`,
      } as UseCaseError);
    }
  }
  export class PartnerNotFoundExistsError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `partnerId is not defined.`,
      } as UseCaseError);
    }
  }

  export class PartnerNotCreatedError extends Result<UseCaseError> {
    constructor(error: string) {
      super(false, {
        message: `partner not created ${error}`,
      } as UseCaseError);
    }
  }
}
