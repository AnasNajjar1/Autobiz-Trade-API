import { ListAdminDto as Response } from '../../dtos/listDto';
import { BaseController } from '../../../../core/infra/BaseController';
import { GetListByIdUseCase } from './GetListByIdUseCase';
import { ListMap } from '../../mappers/ListMap';
import { GetListByIdErrors } from './GetListByIdErrors';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';

interface Request {
  id: number;
}

export class GetListByIdController extends BaseController {
  private useCase: GetListByIdUseCase;

  constructor(useCase: GetListByIdUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: Request = request.path as Request;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case GetListByIdErrors.ListNotFoundError:
            return this.notFound(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        const list = result.value.getValue();

        return this.ok<Response>(ListMap.toAdminDto(list), {
          'Cache-Control': 'max-age=120',
        });
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
