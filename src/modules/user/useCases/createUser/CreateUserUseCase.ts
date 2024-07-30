import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IUserRepo } from '../../repos/userRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { User } from '../../domain/user';
import { UserAutobizUserId } from '../../domain/userAutobizUserId';
import { CreateUserErrors } from './CreateUserErrors';

type Response = Either<AppError.UnexpectedError | Result<any>, Result<User>>;

interface Request {
  autobizUserId: string;
  notificationDaily: boolean;
  notificationNewPush: boolean;
  notificationAuction: boolean;
}

export class CreateUserUseCase implements UseCase<Request, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(request: Request): Promise<Response> {
    const userAutobizUserIdOrError = UserAutobizUserId.create(
      request?.autobizUserId,
    );

    const combinedPropsResult = Result.combine([userAutobizUserIdOrError]);

    if (combinedPropsResult.isFailure) {
      return left(Result.fail<void>(combinedPropsResult.error)) as Response;
    }

    const autobizUserId: UserAutobizUserId = userAutobizUserIdOrError.getValue();

    try {
      const user = await this.userRepo.getUserByAutobizUserId(
        autobizUserId.value,
      );
      const userExists = !!user === true;
      if (userExists) {
        return left(
          new CreateUserErrors.UserAlreadyExistsError(autobizUserId.value),
        ) as Response;
      }
    } catch (error) {
      null;
    }

    try {
      const userOrError: Result<User> = User.create({
        autobizUserId,
        notificationDaily: request?.notificationDaily,
        notificationNewPush: request?.notificationNewPush,
        notificationAuction: request?.notificationAuction,
      });

      if (userOrError.isFailure) {
        return left(userOrError);
      }

      const user: User = await this.userRepo.save(userOrError.getValue());

      return right(Result.ok<User>(user));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
