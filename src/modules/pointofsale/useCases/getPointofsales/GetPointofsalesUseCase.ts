import { pointofsaleFilter } from '../../domain/pointofsaleFilter';
import { Result, Either, right, left } from '../../../../core/logic/Result';
import { IPointofsaleRepo } from '../../repos/pointofsaleRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class GetPointofsalesUseCase
  implements UseCase<pointofsaleFilter, Promise<Response>> {
  private pointofsaleRepo: IPointofsaleRepo;

  constructor(pointofsaleRepo: IPointofsaleRepo) {
    this.pointofsaleRepo = pointofsaleRepo;
  }

  public async execute(request: pointofsaleFilter): Promise<Response> {
    try {
      const pointofsales = await this.pointofsaleRepo.getPointofsales(request);

      return right(Result.ok<any>(pointofsales));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
