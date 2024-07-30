import { BaseController } from '../../../../core/infra/BaseController';
import { GroupIdMap } from '../../mappers/GroupIdMap';
import { CreateGroupUseCase } from './CreateGroupUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';

interface Request {
  name: string;
}

export class CreateGroupController extends BaseController {
  private useCase: CreateGroupUseCase;

  constructor(useCase: CreateGroupUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: Request = request.body as Request;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const group = result.value.getValue();
        return this.created(GroupIdMap.toDto(group));
      } else {
        const error = result.value;
        return this.fail(error.errorValue().message);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
