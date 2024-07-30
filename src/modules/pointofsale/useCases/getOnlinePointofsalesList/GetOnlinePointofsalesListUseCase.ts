import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IPointofsaleRepo } from '../../repos/pointofsaleRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { GetOnlinePointofsalesListRequestDto } from './GetOnlinePointofsalesListRequestDto';
import { Pointofsale } from '../../domain/pointofsale';

interface PaginatedSale {
  count: number;
  limit: number;
  offset: number;
  rows: Pointofsale[];
}

type Response = Either<AppError.UnexpectedError, Result<PaginatedSale>>;

export class GetOnlinePointofsalesListUseCase
  implements UseCase<GetOnlinePointofsalesListRequestDto, Promise<Response>> {
  private pointofsaleRepo: IPointofsaleRepo;

  constructor(pointofsaleRepo: IPointofsaleRepo) {
    this.pointofsaleRepo = pointofsaleRepo;
  }

  public async execute(
    request: GetOnlinePointofsalesListRequestDto,
  ): Promise<Response> {
    try {
      const { list } = request.filter || {};

      const paginatedPointofsales = await this.pointofsaleRepo.getOnlinePointofsalesListByUser(
        request,
      );

      return right(Result.ok<PaginatedSale>(paginatedPointofsales));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
