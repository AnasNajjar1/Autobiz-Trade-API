import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace GetModelsErrors {
  export class CantResolveReferentialApi extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Can't retrive models list from Autobiz Referential API`,
      } as UseCaseError);
    }
  }
}
