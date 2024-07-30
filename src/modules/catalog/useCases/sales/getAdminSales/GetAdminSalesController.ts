import { BaseController } from '../../../../../core/infra/BaseController';
import { GetAdminSalesUseCase } from './GetAdminSalesUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { GetAdminSalesRequestDto } from './GetAdminSalesRequestDto';
import { SaleMap } from '../../../mappers/SaleMap';

export class GetAdminSalesController extends BaseController {
  private useCase: GetAdminSalesUseCase;

  constructor(useCase: GetAdminSalesUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: GetAdminSalesRequestDto = {
        userId: request.user ? request.user : null,
        limit: request.q.limit,
        offset: request.q.offset,
        sortBy: request.q.sortBy,
        sortOrder: request.q.sortOrder,
        filter: request.q.filter,
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const sales = result.value.getValue();

        return this.paginate(
          sales.rows.map((p) => SaleMap.toAdminDto(p)),
          {
            limit: sales.limit,
            offset: sales.offset,
            count: sales.count,
          },
        );
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
