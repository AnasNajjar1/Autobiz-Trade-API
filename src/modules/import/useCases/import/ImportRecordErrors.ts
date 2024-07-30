import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace ImportRecordErrors {
  export class RecordNotFoundError extends Result<UseCaseError> {
    constructor(id: number) {
      super(false, {
        message: `record id ${id} is not found`,
      } as UseCaseError);
    }
  }

  export class SaleIsNotProperlyDefined extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, {
        message: `sale is not defined properly : ${message}`,
      } as UseCaseError);
    }
  }

  export class PointOfSaleError extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, {
        message: `pointofsale error : ${message}`,
      } as UseCaseError);
    }
  }

  export class GroupError extends Result<UseCaseError> {
    constructor(source: string) {
      super(false, {
        message: `'Failed group find or create' : ${source}`,
      } as UseCaseError);
    }
  }

  export class UserError extends Result<UseCaseError> {
    constructor(user: string) {
      super(false, {
        message: `Failed user find or create : ${user}`,
      } as UseCaseError);
    }
  }

  export class VehicleError extends Result<UseCaseError> {
    constructor(message?: string) {
      super(false, {
        message: `Failed vehicle find or create ${message ? message : ''}`,
      } as UseCaseError);
    }
  }

  export class SaleError extends Result<UseCaseError> {
    constructor(message?: string) {
      super(false, {
        message: `Failed sale create ${message ? message : ''}`,
      } as UseCaseError);
    }
  }
}
