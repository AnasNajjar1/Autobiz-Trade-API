import { BaseController } from '../../../../core/infra/BaseController';
import { DeleteGroupByIdUseCase } from './DeleteGroupByIdUseCase';
import { DeleteGroupByIdErrors } from './DeleteGroupByIdErrors';

interface Request {
  id: number;
}

export class DeleteGroupByIdController extends BaseController {
  private useCase: DeleteGroupByIdUseCase;

  constructor(useCase: DeleteGroupByIdUseCase) {
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
          case DeleteGroupByIdErrors.GroupNotFoundError:
            return this.notFound(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        return this.deleted();
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
