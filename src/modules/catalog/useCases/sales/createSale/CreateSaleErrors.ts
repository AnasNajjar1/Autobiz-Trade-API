import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { Result } from '../../../../../core/logic/Result';

export namespace CreateSaleErrors {
  export class ValidationFailed extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, {
        message: `${message}`,
      } as UseCaseError);
    }
  }

  export class VehicleHasAlreadyAValidatedSale extends Result<UseCaseError> {
    constructor(vehicleId: number) {
      super(false, {
        message: `vehicle ${vehicleId} has already a LIVE or SCHEDULED validated sale`,
      } as UseCaseError);
    }
  }

  export class VehicleNotFound extends Result<UseCaseError> {
    constructor(vehicleId: number) {
      super(false, {
        message: `vehicle ${vehicleId} not found`,
      } as UseCaseError);
    }
  }

  export class OwnerNotFound extends Result<UseCaseError> {
    constructor(ownerId: number) {
      super(false, {
        message: `owner ${ownerId} not found`,
      } as UseCaseError);
    }
  }

  export class GroupNotFound extends Result<UseCaseError> {
    constructor(groupId: number) {
      super(false, {
        message: `group ${groupId} not found`,
      } as UseCaseError);
    }
  }
}
