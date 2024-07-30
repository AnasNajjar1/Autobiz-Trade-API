import { LoggedController } from '../../../../../core/infra/LoggedController';
import { GetSaleInfoUseCase } from './GetSaleInfoUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { GetSaleInfoRequestDto } from './GetSaleInfoRequestDto';
import { SaleMap } from '../../../mappers/SaleMap';

export class GetSaleInfoController extends LoggedController {
  private useCase: GetSaleInfoUseCase;

  constructor(loggerService, useCase: GetSaleInfoUseCase) {
    super(loggerService);
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: GetSaleInfoRequestDto = {
        userId: request.user,
        uuid: request.path.uuid,
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const sale = result.value.getValue();

        return this.ok(SaleMap.toPublicSaleInfosDto(sale, dto.userId));
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
