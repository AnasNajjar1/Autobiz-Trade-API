import { BaseController } from '../../../../core/infra/BaseController';
import { UserIdMap } from '../../mappers/UserIdMap';
import { CreateUserUseCase } from './CreateUserUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { CreateUserErrors } from './CreateUserErrors';

interface Request {
  autobizUserId: string;
  notificationDaily: boolean;
  notificationNewPush: boolean;
  notificationAuction: boolean;
}

export class CreateUserController extends BaseController {
  private useCase: CreateUserUseCase;

  constructor(useCase: CreateUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: Request = request.body as Request;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const user = result.value.getValue();
        return this.created(UserIdMap.toDto(user));
      } else {
        const error = result.value;
        switch (error.constructor) {
          case CreateUserErrors.UserAlreadyExistsError:
            return this.conflict(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
