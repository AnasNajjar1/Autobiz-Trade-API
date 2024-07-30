import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace UpdateGroupErrors {
  export class GroupNotFoundError extends Result<UseCaseError> {
    constructor(id: number) {
      super(false, {
        message: `Couldn't find group id ${id}`,
      } as UseCaseError);
    }
  }
}
