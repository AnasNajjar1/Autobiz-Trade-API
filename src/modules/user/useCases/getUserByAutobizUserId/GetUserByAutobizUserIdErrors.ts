import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace GetUserByAutobizUserIdErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor(autobizUserId: string) {
      super(false, {
        message: `Couldn't find autobizUserId ${autobizUserId}`,
      } as UseCaseError);
    }
  }
}
