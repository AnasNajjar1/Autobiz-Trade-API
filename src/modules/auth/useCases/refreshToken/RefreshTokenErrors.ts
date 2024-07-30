import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace RefreshTokenErrors {
  export class RefreshTokenRequired extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `refresh token is required`,
      } as UseCaseError);
    }
  }

  export class CannotRefreshToken extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `can not refresh token`,
      } as UseCaseError);
    }
  }
}
