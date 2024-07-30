import { BaseController } from '../../../../core/infra/BaseController';
import { DeletePointofsaleByIdUseCase } from './DeletePointofsaleByIdUseCase';
import { DeletePointofsaleByIdErrors } from './DeletePointofsaleByIdErrors';

interface Request {
  id: number;
}

export class DeletePointofsaleByIdController extends BaseController {
  private useCase: DeletePointofsaleByIdUseCase;

  constructor(useCase: DeletePointofsaleByIdUseCase) {
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
          case DeletePointofsaleByIdErrors.PointofsaleNotFoundError:
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
