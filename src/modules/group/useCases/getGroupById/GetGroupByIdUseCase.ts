import { GetGroupByIdErrors } from './GetGroupByIdErrors';
import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IGroupRepo } from '../../repos/groupRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { Group } from '../../domain/group';

type Response = Either<
  GetGroupByIdErrors.GroupNotFoundError | AppError.UnexpectedError,
  Result<Group>
>;

interface Request {
  id: number;
}

export class GetGroupByIdUseCase
  implements UseCase<Request, Promise<Response>> {
  private groupRepo: IGroupRepo;

  constructor(groupRepo: IGroupRepo) {
    this.groupRepo = groupRepo;
  }

  public async execute(request: Request): Promise<Response> {
    const groupId = Number(request.id);

    try {
      const group = await this.groupRepo.getGroupById(groupId);

      return right(Result.ok<Group>(group));
    } catch (err) {
      return left(
        new GetGroupByIdErrors.GroupNotFoundError(groupId),
      ) as Response;
    }
  }
}
