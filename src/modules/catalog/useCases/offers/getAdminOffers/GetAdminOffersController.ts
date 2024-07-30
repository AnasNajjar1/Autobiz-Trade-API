import { BaseController } from '../../../../../core/infra/BaseController';
import { GetAdminOffersUseCase } from './GetAdminOffersUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';

export class GetAdminOffersController extends BaseController {
  private useCase: GetAdminOffersUseCase;

  constructor(useCase: GetAdminOffersUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: GetAdminOfferRequestDto = request.q;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        const offers = result.value.getValue();

        return this.paginate(offers.rows, {
          limit: offers.limit,
          offset: offers.offset,
          count: offers.count,
        });
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
