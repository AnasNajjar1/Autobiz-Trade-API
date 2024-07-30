import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace CreateListErrors {
  export class ListAlreadyExistsError extends Result<UseCaseError> {
    constructor(name: string) {
      super(false, {
        message: `List ${name} already exists`,
      } as UseCaseError);
    }
  }
}
