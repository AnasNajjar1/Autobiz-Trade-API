import { BaseController } from '../../../../core/infra/BaseController';
import { DeleteListByIdUseCase } from './DeleteListByIdUseCase';
import { DeleteListByIdErrors } from './DeleteListByIdErrors';

interface Request {
  id: number;
}

export class DeleteListByIdController extends BaseController {
  private useCase: DeleteListByIdUseCase;

  constructor(useCase: DeleteListByIdUseCase) {
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
          case DeleteListByIdErrors.ListNotFoundError:
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
