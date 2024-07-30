import { BaseController } from '../../../../../core/infra/BaseController';
import { DeleteSaleUseCase } from './DeleteSaleUseCase';
import { DeleteSaleErrors } from './DeleteSaleErrors';
import { DeleteSaleRequestDto } from './DeleteSaleRequestDto';

export class DeleteSaleController extends BaseController {
  private useCase: DeleteSaleUseCase;

  constructor(useCase: DeleteSaleUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: any): Promise<any> {
    const dto: DeleteSaleRequestDto = {
      id: request.path.id,
      user: request.user,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case DeleteSaleErrors.SaleNotFoundError:
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
