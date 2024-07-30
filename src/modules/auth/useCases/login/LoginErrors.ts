import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace LoginErrors {
  export class UsernameAndPasswordRequired extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `username and password are required`,
      } as UseCaseError);
    }
  }

  export class CannotLogin extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `can not login`,
      } as UseCaseError);
    }
  }
}
