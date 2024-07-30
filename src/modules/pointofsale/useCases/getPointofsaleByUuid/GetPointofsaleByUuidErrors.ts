import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace GetPointofsaleByUuidErrors {
  export class PointofsaleNotFoundError extends Result<UseCaseError> {
    constructor(uuid: string) {
      super(false, {
        message: `Pointofsale uuid ${uuid} is not found`,
      } as UseCaseError);
    }
  }
}
