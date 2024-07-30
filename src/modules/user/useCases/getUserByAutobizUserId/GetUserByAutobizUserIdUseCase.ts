import { GetUserByAutobizUserIdErrors } from './GetUserByAutobizUserIdErrors';
import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IUserRepo } from '../../repos/userRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { User } from '../../domain/user';

type Response = Either<
  GetUserByAutobizUserIdErrors.UserNotFoundError | AppError.UnexpectedError,
  Result<User>
>;

interface Request {
  autobizUserId: string;
}

export class GetUserByAutobizUserIdUseCase
  implements UseCase<Request, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(request: Request): Promise<Response> {
    let autobizUserId = request.autobizUserId;

    if (!autobizUserId.includes('_')) {
      autobizUserId = autobizUserId.slice(0, 2) + '_' + autobizUserId.slice(2);
    }

    try {
      const user = await this.userRepo.getUserByAutobizUserId(autobizUserId);

      return right(Result.ok<User>(user));
    } catch (err) {
      return left(
        new GetUserByAutobizUserIdErrors.UserNotFoundError(autobizUserId),
      ) as Response;
    }
  }
}
