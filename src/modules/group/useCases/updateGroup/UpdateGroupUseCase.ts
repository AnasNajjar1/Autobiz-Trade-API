import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IGroupRepo } from '../../repos/groupRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { Group } from '../../domain/group';
import { UpdateGroupErrors } from './UpdateGroupErrors';
import { GroupName } from '../../domain/groupName';
import { WithChanges, Changes } from '../../../../core/logic/WithChanges';

type Response = Either<AppError.UnexpectedError | Result<any>, Result<Group>>;

interface Request {
  name: string;
}

export class UpdateGroupUseCase
  implements UseCase<Request, Promise<Response>>, WithChanges {
  private groupRepo: IGroupRepo;
  public changes: Changes;

  constructor(groupRepo: IGroupRepo) {
    this.groupRepo = groupRepo;
    this.changes = new Changes();
  }

  public async execute(request: any): Promise<Response> {
    let group: Group;
    const groupId = request.id;

    try {
      group = await this.groupRepo.getGroupById(groupId);
    } catch (err) {
      return left(
        new UpdateGroupErrors.GroupNotFoundError(groupId),
      ) as Response;
    }

    if (request?.name !== undefined) {
      const groupNameOrError: Result<GroupName> = GroupName.create(
        request.name,
      );

      if (groupNameOrError.isSuccess) {
        this.changes.addChange(group.updateName(groupNameOrError.getValue()));
      } else {
        return left(groupNameOrError);
      }
    }

    if (this.changes.getCombinedChangesResult().isSuccess) {
      try {
        await this.groupRepo.save(group);

        return right(Result.ok<Group>(group));
      } catch (err) {
        return left(new AppError.UnexpectedError(err)) as Response;
      }
    }
  }
}
