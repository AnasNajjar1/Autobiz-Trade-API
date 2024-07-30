import { UserDto as Response } from '../../dtos/userDto';
import { BaseController } from '../../../../core/infra/BaseController';
import { GetUserByIdUseCase } from './GetUserByIdUseCase';
import { UserMap } from '../../mappers/UserMap';
import { GetUserByIdErrors } from './GetUserByIdErrors';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';

interface Request {
  id: number;
}

export class GetUserByIdController extends BaseController {
  private useCase: GetUserByIdUseCase;

  constructor(useCase: GetUserByIdUseCase) {
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
          case GetUserByIdErrors.UserNotFoundError:
            return this.notFound(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        const user = result.value.getValue();

        return this.ok<Response>(UserMap.toDto(user));
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
