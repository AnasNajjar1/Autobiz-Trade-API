import { GetPointofsaleByIdErrors } from './GetPointofsaleByIdErrors';
import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IPointofsaleRepo } from '../../repos/pointofsaleRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { Pointofsale } from '../../domain/pointofsale';

type Response = Either<
  GetPointofsaleByIdErrors.PointofsaleNotFoundError | AppError.UnexpectedError,
  Result<Pointofsale>
>;

interface Request {
  id: number;
}

export class GetPointofsaleByIdUseCase
  implements UseCase<Request, Promise<Response>> {
  private pointofsaleRepo: IPointofsaleRepo;

  constructor(pointofsaleRepo: IPointofsaleRepo) {
    this.pointofsaleRepo = pointofsaleRepo;
  }

  public async execute(request: Request): Promise<Response> {
    const pointofsaleId = Number(request.id);

    try {
      const pointofsale = await this.pointofsaleRepo.getPointofsaleById(
        pointofsaleId,
      );

      return right(Result.ok<Pointofsale>(pointofsale));
    } catch (err) {
      return left(
        new GetPointofsaleByIdErrors.PointofsaleNotFoundError(pointofsaleId),
      ) as Response;
    }
  }
}
