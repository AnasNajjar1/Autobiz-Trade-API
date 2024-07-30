import { DeletePointofsaleByIdErrors } from './DeletePointofsaleByIdErrors';
import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IPointofsaleRepo } from '../../repos/pointofsaleRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { Pointofsale } from '../../domain/pointofsale';

type Response = Either<
  | DeletePointofsaleByIdErrors.PointofsaleNotFoundError
  | AppError.UnexpectedError,
  Result<Pointofsale>
>;

interface Request {
  id: number;
}

export class DeletePointofsaleByIdUseCase
  implements UseCase<Request, Promise<Response>> {
  private pointofsaleRepo: IPointofsaleRepo;

  constructor(pointofsaleRepo: IPointofsaleRepo) {
    this.pointofsaleRepo = pointofsaleRepo;
  }

  public async execute(request: Request): Promise<any> {
    const pointofsaleId = Number(request.id);
    try {
      await this.pointofsaleRepo.deletePointofsaleById(pointofsaleId);

      return right(Result.ok<boolean>(true));
    } catch (err) {
      return left(
        new DeletePointofsaleByIdErrors.PointofsaleNotFoundError(pointofsaleId),
      ) as Response;
    }
  }
}
