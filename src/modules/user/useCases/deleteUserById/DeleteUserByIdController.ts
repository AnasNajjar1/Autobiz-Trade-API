import { BaseController } from '../../../../core/infra/BaseController';
import { DeleteUserByIdUseCase } from './DeleteUserByIdUseCase';
import { DeleteUserByIdErrors } from './DeleteUserByIdErrors';

interface Request {
  id: number;
}

export class DeleteUserByIdController extends BaseController {
  private useCase: DeleteUserByIdUseCase;

  constructor(useCase: DeleteUserByIdUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: any): Promise<any> {
    const dto: Request = request.path as Request;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case DeleteUserByIdErrors.UserNotFoundError:
            return this.notFound(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        return this.ok(dto);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
