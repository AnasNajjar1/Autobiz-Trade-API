import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace GetBrandsErrors {
  export class CantResolveReferentialApi extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Can't retrive brands list from Autobiz Referential API`,
      } as UseCaseError);
    }
  }
}
