import { Result } from '../../../core/logic/Result';
import { UseCaseError } from '../../../core/logic/UseCaseError';

export namespace ApiUserServiceErrors {
  export class UsernameAndPasswordRequired extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `username and password are required`,
      } as UseCaseError);
    }
  }

  export class UserNotAllowed extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `user not allowed`,
      } as UseCaseError);
    }
  }

  export class UserNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `user not found`,
      } as UseCaseError);
    }
  }

  export class WrongUserId extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `wrong user id`,
      } as UseCaseError);
    }
  }
}
