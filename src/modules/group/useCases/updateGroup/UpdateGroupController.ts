import { BaseController } from '../../../../core/infra/BaseController';
import { GroupIdMap } from '../../mappers/GroupIdMap';
import { UpdateGroupUseCase } from './UpdateGroupUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { UpdateGroupErrors } from './UpdateGroupErrors';

interface Request {
  id: number;
  name: string;
}

export class UpdateGroupController extends BaseController {
  private useCase: UpdateGroupUseCase;

  constructor(useCase: UpdateGroupUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: Request = request.body as Request;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const group = result.value.getValue();
        return this.updated(GroupIdMap.toDto(group));
      } else {
        const error = result.value;
        switch (error.constructor) {
          case UpdateGroupErrors.GroupNotFoundError:
            return this.notFound(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
