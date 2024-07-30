import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { Result } from '../../../../../core/logic/Result';

export namespace DeleteOfferErrors {
  export class OfferNotFoundError extends Result<UseCaseError> {
    constructor(id: number) {
      super(false, {
        message: `Couldn't find offer id ${id}`,
      } as UseCaseError);
    }
  }
}
