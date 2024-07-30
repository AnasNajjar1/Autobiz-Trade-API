import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { GetPartnerOffersListRequestDto } from './GetPartnerOffersListRequestDto';
import { PartnerOffer } from '../../domain/partnerOffer';
import { IPartnerOfferRepo } from '../../repos/partnerOfferRepo';

interface PaginatedPartner {
  count: number;
  limit: number;
  offset: number;
  rows: PartnerOffer[];
}

type Response = Either<AppError.UnexpectedError, Result<PaginatedPartner>>;

export class GetPartnerOffersListUseCase
  implements UseCase<GetPartnerOffersListRequestDto, Promise<Response>> {
  private partnerOfferRepo: IPartnerOfferRepo;

  constructor(partnerOfferRepo: IPartnerOfferRepo) {
    this.partnerOfferRepo = partnerOfferRepo;
  }

  public async execute(
    request: GetPartnerOffersListRequestDto,
  ): Promise<Response> {
    try {
      const paginatedPartnerOffers = await this.partnerOfferRepo.getPartnerOffers(
        request,
      );

      return right(Result.ok<PaginatedPartner>(paginatedPartnerOffers));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
