import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IGroupRepo } from '../../repos/groupRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { Group } from '../../domain/group';
import { GroupName } from '../../domain/groupName';

type Response = Either<AppError.UnexpectedError | Result<any>, Result<Group>>;

interface Request {
  name: string;
}

export class CreateGroupUseCase implements UseCase<Request, Promise<Response>> {
  private groupRepo: IGroupRepo;

  constructor(groupRepo: IGroupRepo) {
    this.groupRepo = groupRepo;
  }

  public async execute(request: Request): Promise<Response> {
    const groupNameOrError = GroupName.create(request?.name);

    const combinedPropsResult = Result.combine([groupNameOrError]);

    if (combinedPropsResult.isFailure) {
      return left(Result.fail<void>(combinedPropsResult.error)) as Response;
    }

    const name: GroupName = groupNameOrError.getValue();

    try {
      const groupOrError: Result<Group> = Group.create({
        name,
      });

      if (groupOrError.isFailure) {
        return left(groupOrError);
      }

      const group: Group = await this.groupRepo.save(groupOrError.getValue());

      return right(Result.ok<Group>(group));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
