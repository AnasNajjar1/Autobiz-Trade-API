import { LoggedController } from '../../../../../core/infra/LoggedController';
import { GetSaleByUuidUseCase } from './GetSaleByUuidUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { GetSaleByUuidRequestDto } from './GetSaleByUuidRequestDto';
import { SaleMap } from '../../../mappers/SaleMap';

export class GetSaleByUuidController extends LoggedController {
  private useCase: GetSaleByUuidUseCase;

  constructor(loggerService, useCase: GetSaleByUuidUseCase) {
    super(loggerService);
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: GetSaleByUuidRequestDto = {
        userId: request.user,
        uuid: request.path.uuid,
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const sale = result.value.getValue();

        return this.ok(SaleMap.toPublicFullDto(sale));
      } else {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(result.value.errorValue().message);
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
