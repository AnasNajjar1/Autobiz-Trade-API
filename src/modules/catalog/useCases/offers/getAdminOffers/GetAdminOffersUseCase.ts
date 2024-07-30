//import { pointofsaleFilter } from '../../../domain/pointofsaleFilter';
import { Result, Either, right, left } from '../../../../../core/logic/Result';
import { IOfferRepo } from '../../../repos/offerRepo';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';

interface PaginatedOffers {
  count: number;
  limit: number;
  offset: number;
  rows: [];
}

type Response = Either<AppError.UnexpectedError, Result<PaginatedOffers>>;

export class GetAdminOffersUseCase
  implements UseCase<GetAdminOfferRequestDto, Promise<Response>> {
  private offerRepo: IOfferRepo;

  constructor(offerRepo: IOfferRepo) {
    this.offerRepo = offerRepo;
  }

  public async execute(request: GetAdminOfferRequestDto): Promise<Response> {
    try {
      const paginatedOffers = await this.offerRepo.getAdminOffers(request);

      return right(Result.ok<PaginatedOffers>(paginatedOffers));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
