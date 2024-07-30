import { DeleteGroupByIdErrors } from './DeleteGroupByIdErrors';
import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IGroupRepo } from '../../repos/groupRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { Group } from '../../domain/group';

type Response = Either<
  DeleteGroupByIdErrors.GroupNotFoundError | AppError.UnexpectedError,
  Result<Group>
>;

interface Request {
  id: number;
}

export class DeleteGroupByIdUseCase
  implements UseCase<Request, Promise<Response>> {
  private groupRepo: IGroupRepo;

  constructor(groupRepo: IGroupRepo) {
    this.groupRepo = groupRepo;
  }

  public async execute(request: Request): Promise<any> {
    const groupId = Number(request.id);
    try {
      await this.groupRepo.deleteGroupById(groupId);

      return right(Result.ok<boolean>(true));
    } catch (err) {
      return left(
        new DeleteGroupByIdErrors.GroupNotFoundError(groupId),
      ) as Response;
    }
  }
}
