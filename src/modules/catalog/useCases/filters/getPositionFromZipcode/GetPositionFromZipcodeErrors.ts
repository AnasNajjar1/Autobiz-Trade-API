import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { Result } from '../../../../../core/logic/Result';

export namespace GetPositionFromZipcodeErrors {
  export class ZipcodeNotFoundError extends Result<UseCaseError> {
    constructor(zipcode: string, country: string) {
      super(false, {
        message: `Couldn't not locate  zipcode ${zipcode} in ${country}`,
      } as UseCaseError);
    }
  }
}
