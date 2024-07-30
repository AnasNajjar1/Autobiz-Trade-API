import { DeleteOfferErrors } from './DeleteOfferErrors';
import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { IOfferRepo } from '../../../repos/offerRepo';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Offer } from '../../../domain/offer';

type Response = Either<
  DeleteOfferErrors.OfferNotFoundError | AppError.UnexpectedError,
  Result<Offer>
>;

interface Request {
  id: number;
}

export class DeleteOfferUseCase implements UseCase<Request, Promise<Response>> {
  private offerRepo: IOfferRepo;

  constructor(offerRepo: IOfferRepo) {
    this.offerRepo = offerRepo;
  }

  public async execute(request: Request): Promise<any> {
    const offerId = Number(request.id);
    try {
      await this.offerRepo.delete(offerId);

      return right(Result.ok<boolean>(true));
    } catch (err) {
      return left(
        new DeleteOfferErrors.OfferNotFoundError(offerId),
      ) as Response;
    }
  }
}
