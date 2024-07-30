import { userFilter } from '../../domain/userFilter';
import { Result, Either, right, left } from '../../../../core/logic/Result';
import { IUserRepo } from '../../repos/userRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class GetUsersUseCase implements UseCase<userFilter, Promise<Response>> {
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  public async execute(request: userFilter): Promise<Response> {
    try {
      const users = await this.userRepo.getUsers(request);

      return right(Result.ok<any>(users));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
