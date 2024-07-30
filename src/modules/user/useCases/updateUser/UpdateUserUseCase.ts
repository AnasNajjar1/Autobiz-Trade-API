import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IUserRepo } from '../../repos/userRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { User } from '../../domain/user';
import { UpdateUserErrors } from './UpdateUserErrors';
import { UserAutobizUserId } from '../../domain/userAutobizUserId';
import { WithChanges, Changes } from '../../../../core/logic/WithChanges';

type Response = Either<AppError.UnexpectedError | Result<any>, Result<User>>;

interface Request {
  name: string;
}

export class UpdateUserUseCase
  implements UseCase<Request, Promise<Response>>, WithChanges {
  private userRepo: IUserRepo;
  public changes: Changes;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
    this.changes = new Changes();
  }

  public async execute(request: any): Promise<Response> {
    let user: User;
    const userId = request.id;

    try {
      user = await this.userRepo.getUserById(userId);
    } catch (err) {
      return left(new UpdateUserErrors.UserNotFoundError(userId)) as Response;
    }

    if (request?.autobizUserId !== undefined) {
      const userAutobizUserIdOrError: Result<UserAutobizUserId> = UserAutobizUserId.create(
        request.autobizUserId,
      );

      if (userAutobizUserIdOrError.isSuccess) {
        this.changes.addChange(
          user.updateAutobizUserId(userAutobizUserIdOrError.getValue()),
        );
      } else {
        return left(userAutobizUserIdOrError);
      }
    }

    if (request?.notificationDaily !== undefined) {
      this.changes.addChange(
        user.updateNotificationDaily(request.notificationDaily),
      );
    }

    if (request?.notificationNewPush !== undefined) {
      this.changes.addChange(
        user.updateNotificationNewPush(request.notificationNewPush),
      );
    }

    if (request?.notificationAuction !== undefined) {
      this.changes.addChange(
        user.updateNotificationAuction(request.notificationAuction),
      );
    }

    if (request?.inGroups !== undefined) {
      this.changes.addChange(user.updateInGroups(request.inGroups));
    }

    if (request?.hasGroups !== undefined) {
      this.changes.addChange(user.updateHasGroups(request.hasGroups));
    }

    if (this.changes.getCombinedChangesResult().isSuccess) {
      try {
        await this.userRepo.save(user);

        return right(Result.ok<User>(user));
      } catch (err) {
        return left(new AppError.UnexpectedError(err)) as Response;
      }
    }
  }
}
