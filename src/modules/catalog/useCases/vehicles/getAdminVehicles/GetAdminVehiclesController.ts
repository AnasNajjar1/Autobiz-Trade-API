import { BaseController } from '../../../../../core/infra/BaseController';
import { GetAdminVehiclesUseCase } from './GetAdminVehiclesUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { GetAdminVehiclesRequestDto } from './GetAdminVehiclesRequestDto';
import { VehicleMap } from '../../../mappers/VehicleMap';

// interface Response {
//   limit: number;
//   offset: number;
//   rows: Array<VehicleDto>;
//   count: number;
// }

export class GetAdminVehiclesController extends BaseController {
  private useCase: GetAdminVehiclesUseCase;

  constructor(useCase: GetAdminVehiclesUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: GetAdminVehiclesRequestDto = {
        userId: request.user ? request.user : null,
        limit: request.q.limit,
        offset: request.q.offset,
        sortBy: request.q.sortBy,
        sortOrder: request.q.sortOrder,
        filter: request.q.filter,
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const vehicles = result.value.getValue();

        return this.paginate(
          vehicles.rows.map((p) => VehicleMap.toAdminShortDto(p)),
          {
            limit: vehicles.limit,
            offset: vehicles.offset,
            count: vehicles.count,
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
