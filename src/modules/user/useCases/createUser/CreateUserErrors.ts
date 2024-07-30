import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace CreateUserErrors {
  export class UserAlreadyExistsError extends Result<UseCaseError> {
    constructor(autobizUserId: string) {
      super(false, {
        message: `User ${autobizUserId} already exists`,
      } as UseCaseError);
    }
  }
}