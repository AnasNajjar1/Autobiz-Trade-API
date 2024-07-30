import { BaseController } from '../../../../../core/infra/BaseController';
import { GetOffersUseCase } from './GetOffersUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';

export class GetOffersController extends BaseController {
  private useCase: GetOffersUseCase;

  constructor(useCase: GetOffersUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: GetOfferRequestDto = request.q;

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
