import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { Result } from '../../../../../core/logic/Result';

export namespace GetSaleByUuidErrors {
  export class SaleNotFoundError extends Result<UseCaseError> {
    constructor(uuid: string) {
      super(false, {
        message: `Sale uuid ${uuid} is not found`,
      } as UseCaseError);
    }
  }

  export class SaleCanNotBeFiltered extends Result<UseCaseError> {
    constructor(uuid: string) {
      super(false, {
        message: `Can't filter Sale uuid ${uuid} `,
      } as UseCaseError);
    }
  }
}
