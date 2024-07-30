import { UserDto as Response } from '../../dtos/userDto';
import { BaseController } from '../../../../core/infra/BaseController';
import { GetUserByAutobizUserIdUseCase } from './GetUserByAutobizUserIdUseCase';
import { UserMap } from '../../mappers/UserMap';
import { GetUserByAutobizUserIdErrors } from './GetUserByAutobizUserIdErrors';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';

interface Request {
  autobizUserId: string;
}

export class GetUserByAutobizUserIdController extends BaseController {
  private useCase: GetUserByAutobizUserIdUseCase;

  constructor(useCase: GetUserByAutobizUserIdUseCase) {
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
          case GetUserByAutobizUserIdErrors.UserNotFoundError:
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
