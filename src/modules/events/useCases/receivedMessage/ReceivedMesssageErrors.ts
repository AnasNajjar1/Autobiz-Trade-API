import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace ReceivedMesssageErrors {
  export class SubjectUnknownError extends Result<UseCaseError> {
    constructor(subject: string) {
      super(false, {
        message: `Subject ${subject} is unknown`,
      } as UseCaseError);
    }
  }
}
