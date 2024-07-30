import { Result } from './../../core/logic/Result';
import { UseCaseError } from './../../core/logic/UseCaseError';

export namespace ApiPartnerServiceErrors {
  export class ValidationFailed extends Result<UseCaseError> {
    constructor(error) {
      super(false, {
        message: `Validation error: ${error}`,
      } as UseCaseError);
    }
  }

  export class PartnerRequestFailed extends Result<UseCaseError> {
    constructor(error) {
      super(false, {
        message: error,
      } as UseCaseError);
    }
  }

  export class PartnerRequestInterruption extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Partner Request: erreur lors de la transmission au partenaire`,
      } as UseCaseError);
    }
  }
}
