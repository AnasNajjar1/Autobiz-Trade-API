import { PointofsaleDto as Response } from '../../dtos/pointofsaleDto';
import { LoggedController } from '../../../../core/infra/LoggedController';
import { GetPointofsaleByIdUseCase } from './GetPointofsaleByIdUseCase';
import { PointofsaleMap } from '../../mappers/PointofsaleMap';
import { GetPointofsaleByIdErrors } from './GetPointofsaleByIdErrors';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';

interface Request {
  id: number;
}

export class GetPointofsaleByIdController extends LoggedController {
  private useCase: GetPointofsaleByIdUseCase;

  constructor(loggerService, useCase: GetPointofsaleByIdUseCase) {
    super(loggerService);
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: Request = request.path as Request;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case GetPointofsaleByIdErrors.PointofsaleNotFoundError:
            return this.notFound(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        const pointofsale = result.value.getValue();

        return this.ok<Response>(PointofsaleMap.toAdminFullDto(pointofsale));
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
