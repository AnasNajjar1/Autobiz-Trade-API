import { BaseController } from '../../../../../core/infra/BaseController';
import { MakeOfferUseCase } from './MakeOfferUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { MakeOfferRequestDto } from './MakeOfferRequestDto';
import { SaleMap } from '../../../mappers/SaleMap';
import { MakeOfferErrors } from './MakeOfferErrors';

export class MakeOfferController extends BaseController {
  private useCase: MakeOfferUseCase;

  constructor(useCase: MakeOfferUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: MakeOfferRequestDto = {
        userId: request.user,
        saleUuid: request.path.uuid,
        offerType: request.body.offerType,
        amount: Number(request.body.amount),
      };

      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case MakeOfferErrors.OfferIsNotValidError:
          case MakeOfferErrors.SaleNotFoundError:
          case MakeOfferErrors.UserIdIsNotValidError:
            return this.fail(error.errorValue().message);
          default:
            return this.fail('unexpected error');
        }
      } else {
        const saleInfo = result.value.getValue();

        return this.ok(SaleMap.toPublicSaleInfosDto(saleInfo, dto.userId));
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
