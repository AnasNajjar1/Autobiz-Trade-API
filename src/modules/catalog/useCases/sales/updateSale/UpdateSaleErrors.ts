import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { Result } from '../../../../../core/logic/Result';

export namespace UpdateSaleErrors {
  export class ValidationFailed extends Result<UseCaseError> {
    constructor(id: number, message: string) {
      super(false, {
        message: `Sale ID ${id} update failed : ${message}`,
      } as UseCaseError);
    }
  }
  export class SaleNotFoundError extends Result<UseCaseError> {
    constructor(id: number) {
      super(false, {
        message: `Sale id ${id} is not found`,
      } as UseCaseError);
    }
  }
  export class WrongValidationStatus extends Result<UseCaseError> {
    constructor(saleId: number, oldStatus: string, newStatus: string) {
      super(false, {
        message: `Can not change sale ${saleId} validationStatus from ${oldStatus} to ${newStatus}`,
      } as UseCaseError);
    }
  }

  export class VehicleHasAlreadyAValidatedSale extends Result<UseCaseError> {
    constructor(saleId: number, vehicleId: number) {
      super(false, {
        message: `Can not validate sale ${saleId}, vehicle ${vehicleId} has already a LIVE or SCHEDULED validated sale`,
      } as UseCaseError);
    }
  }
}
