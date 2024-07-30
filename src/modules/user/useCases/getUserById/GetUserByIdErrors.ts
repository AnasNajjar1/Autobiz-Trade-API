import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace GetUserByIdErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor(id: number) {
      super(false, {
        message: `Couldn't find user id ${id}`,
      } as UseCaseError);
    }
  }
}
