import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { Result } from '../../../../../core/logic/Result';

export namespace DeleteSaleErrors {
  export class SaleNotFoundError extends Result<UseCaseError> {
    constructor(id: number) {
      super(false, {
        message: `Sale ID ${id} is not found`,
      } as UseCaseError);
    }
  }

  export class SaleIsValidatedError extends Result<UseCaseError> {
    constructor(id: number) {
      super(false, {
        message: `Can't delete an validated Sale ID ${id} `,
      } as UseCaseError);
    }
  }
}
