import { GroupDto as Response } from '../../dtos/groupDto';
import { BaseController } from '../../../../core/infra/BaseController';
import { GetGroupByIdUseCase } from './GetGroupByIdUseCase';
import { GroupMap } from '../../mappers/GroupMap';
import { GetGroupByIdErrors } from './GetGroupByIdErrors';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';

interface Request {
  id: number;
}

export class GetGroupByIdController extends BaseController {
  private useCase: GetGroupByIdUseCase;

  constructor(useCase: GetGroupByIdUseCase) {
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
          case GetGroupByIdErrors.GroupNotFoundError:
            return this.notFound(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        const group = result.value.getValue();

        return this.ok<Response>(GroupMap.toDto(group), {
          'Cache-Control': 'max-age=120',
        });
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
