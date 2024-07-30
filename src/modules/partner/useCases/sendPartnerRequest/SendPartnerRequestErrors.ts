import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace SendPartnerRequestErrors {
  export class PartnerNotFoundExistsError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `unknown partner.`,
      } as UseCaseError);
    }
  }
}
