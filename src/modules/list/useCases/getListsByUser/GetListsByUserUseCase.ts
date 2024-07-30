//import { listFilter } from '../../domain/listFilter';
import { Result, Either, right, left } from '../../../../core/logic/Result';
import { IListRepo } from '../../repos/listRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { GetListsByUserRequestDto } from './GetListsByUserRequestDto';
import { List } from '../../domain/list';

interface PaginatedLists {
  count: number;
  limit: number;
  offset: number;
  rows: List[];
}

type Response = Either<AppError.UnexpectedError, Result<PaginatedLists>>;

export class GetListsByUserUseCase
  implements UseCase<GetListsByUserRequestDto, Promise<Response>> {
  private listRepo: IListRepo;

  constructor(listRepo: IListRepo) {
    this.listRepo = listRepo;
  }

  public async execute(request: GetListsByUserRequestDto): Promise<Response> {
    try {
      const lists = await this.listRepo.getOnlineListsByUser(request.userId);

      return right(Result.ok<PaginatedLists>(lists));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
