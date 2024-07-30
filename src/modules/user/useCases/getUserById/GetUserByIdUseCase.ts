import { GetUserByIdErrors } from './GetUserByIdErrors';
import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IUserRepo } from '../../repos/userRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { User } from '../../domain/user';

type Response = Either<
  GetUserByIdErrors.UserNotFoundError | AppError.UnexpectedError,
  Result<User>
>;

interface Request {
  id: number;
}

export class GetUserByIdUseCase implements UseCase<Request, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(request: Request): Promise<Response> {
    const userId = Number(request.id);

    try {
      const user = await this.userRepo.getUserById(userId);

      return right(Result.ok<User>(user));
    } catch (err) {
      return left(new GetUserByIdErrors.UserNotFoundError(userId)) as Response;
    }
  }
}
