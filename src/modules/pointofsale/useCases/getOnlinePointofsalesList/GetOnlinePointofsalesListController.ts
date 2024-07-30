import { BaseController } from '../../../../core/infra/BaseController';
import { GetOnlinePointofsalesListUseCase } from './GetOnlinePointofsalesListUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { GetOnlinePointofsalesListRequestDto } from './GetOnlinePointofsalesListRequestDto';
import { PointofsaleMap } from '../../mappers/PointofsaleMap';
import { PointofsaleIdMap } from '../../mappers/PointofsaleIdMap';

// interface Response {
//   limit: number;
//   offset: number;
//   rows: Array<VehicleDto>;
//   count: number;
// }

export class GetOnlinePointofsalesListController extends BaseController {
  private useCase: GetOnlinePointofsalesListUseCase;

  constructor(useCase: GetOnlinePointofsalesListUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: GetOnlinePointofsalesListRequestDto = {
        userId: request.user ? request.user : null,
        limit: request.q.limit,
        offset: request.q.offset,
        filter: request.q.filter,
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const sales = result.value.getValue();

        return this.paginate(
          sales.rows.map((p) => PointofsaleMap.toPublicShortDto(p)),
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
