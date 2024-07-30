import { BaseController } from '../../../../../core/infra/BaseController';
import { GetAdminSaleByIdUseCase } from './GetAdminSaleByIdUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { GetAdminSaleByIdRequestDto } from './GetAdminSaleByIdRequestDto';
import { SaleMap } from '../../../mappers/SaleMap';

export class GetAdminSaleByIdController extends BaseController {
  private useCase: GetAdminSaleByIdUseCase;

  constructor(useCase: GetAdminSaleByIdUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: GetAdminSaleByIdRequestDto = {
        id: request.path.id,
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const sale = result.value.getValue();
        return this.ok(SaleMap.toAdminDto(sale));
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
