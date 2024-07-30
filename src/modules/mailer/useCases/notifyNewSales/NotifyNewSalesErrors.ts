import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace NotifyNewSalesErrors {
  export class UserNotFoundExistsError extends Result<UseCaseError> {
    constructor(userId: string) {
      super(false, {
        message: `User ${userId} not found`,
      } as UseCaseError);
    }
  }
}
