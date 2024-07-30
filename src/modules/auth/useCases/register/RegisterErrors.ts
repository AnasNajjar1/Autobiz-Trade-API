import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace RegisterErrors {
  export class ValidationFailed extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, {
        message: `Validation Failed: ${message}`,
      } as UseCaseError);
    }
  }
}
