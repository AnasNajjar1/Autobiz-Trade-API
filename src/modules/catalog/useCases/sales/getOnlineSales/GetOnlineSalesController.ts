import { LoggedController } from '../../../../../core/infra/LoggedController';
import { GetOnlineSalesUseCase } from './GetOnlineSalesUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { GetOnlineSalesRequestDto } from './GetOnlineSalesRequestDto';
import { SaleMap } from '../../../mappers/SaleMap';

// interface Response {
//   limit: number;
//   offset: number;
//   rows: Array<VehicleDto>;
//   count: number;
// }

export class GetOnlineSalesController extends LoggedController {
  private useCase: GetOnlineSalesUseCase;

  constructor(loggerService, useCase: GetOnlineSalesUseCase) {
    super(loggerService);
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    let sortBy = request.q.sortBy;
    let sortOrder = request.q.sortOrder;

    if (request.queryString?.sortLabel) {
      switch (request.queryString.sortLabel) {
        case 'sort_mileage_asc':
          sortBy = 'mileage';
          sortOrder = 'ASC';
          break;
        case 'sort_mileage_desc':
          sortBy = 'mileage';
          sortOrder = 'DESC';
          break;
        case 'selling_price_asc':
          sortBy = 'sellingPrice';
          sortOrder = 'ASC';
          break;
        case 'selling_price_desc':
          sortBy = 'sellingPrice';
          sortOrder = 'DESC';
          break;
        case 'sort_sales_ending_soon_asc':
          sortBy = 'secondsBeforeEnd';
          sortOrder = 'ASC';
          break;
        case 'sort_sales_ending_soon_desc':
          sortBy = 'secondsBeforeEnd';
          sortOrder = 'DESC';
          break;
      }
    }

    try {
      const dto: GetOnlineSalesRequestDto = {
        userId: request.user ? request.user : null,
        limit: request.q.limit,
        offset: request.q.offset,
        sortBy,
        sortOrder,
        filter: request.q.filter,
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const sales = result.value.getValue();

        return this.paginate(
          sales.rows.map((p) => SaleMap.toPublicShortDto(p)),
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
