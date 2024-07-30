import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace LogoutErrors {
  export class CannotLogout extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `can not logout`,
      } as UseCaseError);
    }
  }
}
