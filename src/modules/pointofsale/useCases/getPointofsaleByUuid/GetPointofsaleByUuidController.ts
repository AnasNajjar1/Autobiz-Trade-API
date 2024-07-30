import { LoggedController } from '../../../../core/infra/LoggedController';
import { GetPointofsaleByUuidUseCase } from './GetPointofsalealeByUuidUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { GetPointofsaleByUuidRequestDto } from './GetPointofsaleByUuidRequestDto';
import { PointofsaleMap } from '../../mappers/PointofsaleMap';
import { Pointofsale } from '../../domain/pointofsale';

export class GetPointofsaleByUuidController extends LoggedController {
  private useCase: GetPointofsaleByUuidUseCase;

  constructor(loggerService, useCase: GetPointofsaleByUuidUseCase) {
    super(loggerService);
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: GetPointofsaleByUuidRequestDto = {
        userId: request.user,
        uuid: request.path.uuid,
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const sale = result.value.getValue();

        return this.ok(PointofsaleMap.toPublicFullDto(sale));
      } else {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(result.value.errorValue().message);
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
