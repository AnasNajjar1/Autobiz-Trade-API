import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace MaskRegistrationListErrors {
  export class messengerError extends Result<UseCaseError> {
    constructor(title: string, key: string) {
      super(false, {
        message: `message encountered a problem`,
      } as UseCaseError);
    }
  }
}
