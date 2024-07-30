import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace GetListByIdErrors {
  export class ListNotFoundError extends Result<UseCaseError> {
    constructor(id: number) {
      super(false, {
        message: `Couldn't find list id ${id}`,
      } as UseCaseError);
    }
  }
}
