import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace GetPointofsaleByIdErrors {
  export class PointofsaleNotFoundError extends Result<UseCaseError> {
    constructor(id: number) {
      super(false, {
        message: `Couldn't find pointofsale id ${id}`,
      } as UseCaseError);
    }
  }
}
