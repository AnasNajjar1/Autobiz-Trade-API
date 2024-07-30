import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace CreatePointofsaleErrors {
  export class PointofsaleAlreadyExistsError extends Result<UseCaseError> {
    constructor(name: string) {
      super(false, {
        message: `Pointofsale ${name} already exists`,
      } as UseCaseError);
    }
  }

  export class CantImportDealer extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `Cant import dealer from external source`,
      } as UseCaseError);
    }
  }
}
