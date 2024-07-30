import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { Result } from '../../../../../core/logic/Result';

export namespace MakeOfferErrors {
  export class SaleNotFoundError extends Result<UseCaseError> {
    constructor(sale: string) {
      super(false, {
        message: `Sale ${sale} is not found`,
      } as UseCaseError);
    }
  }

  export class OfferIsNotValidError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Offer is not valid`,
      } as UseCaseError);
    }
  }
  export class UserIdIsNotValidError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Owner can't make offer`,
      } as UseCaseError);
    }
  }
}
