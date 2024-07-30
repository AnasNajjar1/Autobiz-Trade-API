import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IPointofsaleRepo } from '../../repos/pointofsaleRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { GetPointofsaleByUuidRequestDto } from './GetPointofsaleByUuidRequestDto';
import { Pointofsale } from '../../domain/pointofsale';

import { GetPointofsaleByUuidErrors } from './GetPointofsaleByUuidErrors';

type Response = Either<
  | AppError.UnexpectedError
  | GetPointofsaleByUuidErrors.PointofsaleNotFoundError,
  Result<Pointofsale>
>;

export class GetPointofsaleByUuidUseCase
  implements UseCase<GetPointofsaleByUuidRequestDto, Promise<Response>> {
  private pointofsaleRepo: IPointofsaleRepo;

  constructor(pointofsaleRepo: IPointofsaleRepo) {
    this.pointofsaleRepo = pointofsaleRepo;
  }

  public async execute(
    request: GetPointofsaleByUuidRequestDto,
  ): Promise<Response> {
    try {
      const { uuid, userId } = request;
      const pointofsale = await this.pointofsaleRepo.getPointofsaleByUuid(
        uuid,
        userId,
      );

      return right(Result.ok<Pointofsale>(pointofsale));
    } catch (err) {
      return left(
        new GetPointofsaleByUuidErrors.PointofsaleNotFoundError(request.uuid),
      ) as Response;
    }
  }
}
