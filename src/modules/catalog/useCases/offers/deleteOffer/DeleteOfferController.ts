import { BaseController } from '../../../../../core/infra/BaseController';
import { DeleteOfferUseCase } from './DeleteOfferUseCase';
import { DeleteOfferErrors } from './DeleteOfferErrors';

interface Request {
  id: number;
}

export class DeleteOfferController extends BaseController {
  private useCase: DeleteOfferUseCase;

  constructor(useCase: DeleteOfferUseCase) {
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
          case DeleteOfferErrors.OfferNotFoundError:
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
