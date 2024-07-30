import { DeleteUserByIdErrors } from './DeleteUserByIdErrors';
import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IUserRepo } from '../../repos/userRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { User } from '../../domain/user';

type Response = Either<
  DeleteUserByIdErrors.UserNotFoundError | AppError.UnexpectedError,
  Result<User>
>;

interface Request {
  id: number;
}

export class DeleteUserByIdUseCase
  implements UseCase<Request, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(request: Request): Promise<any> {
    const userId = Number(request.id);
    try {
      await this.userRepo.deleteUserById(userId);

      return right(Result.ok<boolean>(true));
    } catch (err) {
      return left(
        new DeleteUserByIdErrors.UserNotFoundError(userId),
      ) as Response;
    }
  }
}
