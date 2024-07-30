import { groupFilter } from '../../domain/groupFilter';
import { Result, Either, right, left } from '../../../../core/logic/Result';
import { IGroupRepo } from '../../repos/groupRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class GetGroupsUseCase
  implements UseCase<groupFilter, Promise<Response>> {
  private groupRepo: IGroupRepo;

  constructor(groupRepo: IGroupRepo) {
    this.groupRepo = groupRepo;
  }

  public async execute(request: groupFilter): Promise<Response> {
    try {
      const groups = await this.groupRepo.getGroups(request);

      return right(Result.ok<any>(groups));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
