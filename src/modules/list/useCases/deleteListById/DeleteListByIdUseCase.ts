import { DeleteListByIdErrors } from './DeleteListByIdErrors';
import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IListRepo } from '../../repos/listRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { List } from '../../domain/list';

type Response = Either<
  DeleteListByIdErrors.ListNotFoundError | AppError.UnexpectedError,
  Result<List>
>;

interface Request {
  id: number;
}

export class DeleteListByIdUseCase
  implements UseCase<Request, Promise<Response>> {
  private listRepo: IListRepo;

  constructor(listRepo: IListRepo) {
    this.listRepo = listRepo;
  }

  public async execute(request: Request): Promise<any> {
    const listId = Number(request.id);
    try {
      await this.listRepo.deleteListById(listId);

      return right(Result.ok<boolean>(true));
    } catch (err) {
      return left(
        new DeleteListByIdErrors.ListNotFoundError(listId),
      ) as Response;
    }
  }
}
