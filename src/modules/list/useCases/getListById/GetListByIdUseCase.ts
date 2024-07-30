import { GetListByIdErrors } from './GetListByIdErrors';
import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IListRepo } from '../../repos/listRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { List } from '../../domain/list';

type Response = Either<
  GetListByIdErrors.ListNotFoundError | AppError.UnexpectedError,
  Result<List>
>;

interface Request {
  id: number;
}

export class GetListByIdUseCase implements UseCase<Request, Promise<Response>> {
  private listRepo: IListRepo;

  constructor(listRepo: IListRepo) {
    this.listRepo = listRepo;
  }

  public async execute(request: Request): Promise<Response> {
    const listId = Number(request.id);

    try {
      const list = await this.listRepo.getListById(listId);

      return right(Result.ok<List>(list));
    } catch (err) {
      return left(new GetListByIdErrors.ListNotFoundError(listId)) as Response;
    }
  }
}
