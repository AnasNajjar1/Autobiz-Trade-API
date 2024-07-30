import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { GetPartnerRequestsListRequestDto } from './GetPartnerRequestsListRequestDto';
import { PartnerRequest } from '../../domain/partnerRequest';
import { IPartnerRequestRepo } from '../../repos/partnerRequestRepo';

interface PaginatedPartner {
  count: number;
  limit: number;
  offset: number;
  rows: PartnerRequest[];
}

type Response = Either<AppError.UnexpectedError, Result<PaginatedPartner>>;

export class GetPartnerRequestsListUseCase
  implements UseCase<GetPartnerRequestsListRequestDto, Promise<Response>> {
  private partnerRequestRepo: IPartnerRequestRepo;

  constructor(partnerRequestRepo: IPartnerRequestRepo) {
    this.partnerRequestRepo = partnerRequestRepo;
  }

  public async execute(
    request: GetPartnerRequestsListRequestDto,
  ): Promise<Response> {
    try {
      const paginatedPartnerRequests = await this.partnerRequestRepo.getPartnerRequests(
        request,
      );

      return right(Result.ok<PaginatedPartner>(paginatedPartnerRequests));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
