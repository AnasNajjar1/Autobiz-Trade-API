import { listFilter } from '../../domain/listFilter';
import { Result, Either, right, left } from '../../../../core/logic/Result';
import { IListRepo } from '../../repos/listRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { List } from '../../domain/list';

interface PaginatedList {
  count: number;
  limit: number;
  offset: number;
  rows: List[];
}

type Response = Either<AppError.UnexpectedError, Result<PaginatedList>>;

export class GetListsUseCase implements UseCase<listFilter, Promise<Response>> {
  private listRepo: IListRepo;

  constructor(listRepo: IListRepo) {
    this.listRepo = listRepo;
  }

  public async execute(request: listFilter): Promise<Response> {
    try {
      const paginatedLists = await this.listRepo.getLists(request);

      return right(Result.ok<PaginatedList>(paginatedLists));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
