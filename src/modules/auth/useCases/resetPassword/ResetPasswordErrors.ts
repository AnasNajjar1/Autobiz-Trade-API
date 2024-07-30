import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace ResetPasswordErrors {

  export class UsernameRequired extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `username is required`,
      } as UseCaseError);
    }
  }

  export class CannotResetPassword extends Result<UseCaseError> {
    constructor(username) {
      super(false, {
        message: `Cannot reset password with username ${username}`,
      } as UseCaseError);
    }
  }
}