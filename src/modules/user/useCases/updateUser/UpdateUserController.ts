import { BaseController } from '../../../../core/infra/BaseController';
import { UserIdMap } from '../../mappers/UserIdMap';
import { UpdateUserUseCase } from './UpdateUserUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { UpdateUserErrors } from './UpdateUserErrors';

interface Request {
  id: number;
  name: string;
}

export class UpdateUserController extends BaseController {
  private useCase: UpdateUserUseCase;

  constructor(useCase: UpdateUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: Request = request.body as Request;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const user = result.value.getValue();
        return this.updated(UserIdMap.toDto(user));
      } else {
        return this.fail(result.value.errorValue().message);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
