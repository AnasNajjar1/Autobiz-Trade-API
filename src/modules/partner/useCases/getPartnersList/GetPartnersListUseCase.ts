import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IPartnerRepo } from '../../repos/partnerRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { GetPartnersListRequestDto } from './GetPartnersListRequestDto';
import { Partner } from '../../domain/partner';

interface PaginatedPartner {
  count: number;
  limit: number;
  offset: number;
  rows: Partner[];
}

type Response = Either<AppError.UnexpectedError, Result<PaginatedPartner>>;

export class GetPartnersListUseCase
  implements UseCase<GetPartnersListRequestDto, Promise<Response>> {
  private partnerRepo: IPartnerRepo;

  constructor(partnerRepo: IPartnerRepo) {
    this.partnerRepo = partnerRepo;
  }

  public async execute(request: GetPartnersListRequestDto): Promise<Response> {
    try {
      const paginatedPartners = await this.partnerRepo.getPartners(request);

      return right(Result.ok<PaginatedPartner>(paginatedPartners));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
