import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { GetPositionFromZipcodeRequestDto } from './GetPositionFromZipcodeRequestDto';
import { IGeoCodeService } from '../../../../../infra/geocode/GeoCodeService';
import { GetPositionFromZipcodeErrors } from './GetPositionFromZipcodeErrors';

type Response = Either<
  AppError.UnexpectedError | GetPositionFromZipcodeErrors.ZipcodeNotFoundError,
  Result<{ lat: string; lng: string }>
>;

export class GetPositionFromZipcodeUseCase
  implements UseCase<GetPositionFromZipcodeRequestDto, Promise<Response>> {
  private geoCodeService: IGeoCodeService;

  constructor(geoCodeService: IGeoCodeService) {
    this.geoCodeService = geoCodeService;
  }

  public async execute(
    request: GetPositionFromZipcodeRequestDto,
  ): Promise<Response> {
    try {
      const position = await this.geoCodeService.getPosition(
        request.zipCode,
        request.country,
      );

      return right(Result.ok(position));
    } catch (err) {
      return left(
        new GetPositionFromZipcodeErrors.ZipcodeNotFoundError(
          request?.zipCode,
          request?.country,
        ),
      );
    }
  }
}
