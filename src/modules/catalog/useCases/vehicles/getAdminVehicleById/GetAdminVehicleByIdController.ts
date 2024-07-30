import { BaseController } from '../../../../../core/infra/BaseController';
import { GetAdminVehicleByIdUseCase } from './GetAdminVehicleByIdUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { GetAdminVehicleByIdRequestDto } from './GetAdminVehicleByIdRequestDto';
import { VehicleMap } from '../../../mappers/VehicleMap';
import { Vehicle } from '../../../domain/vehicle';
import { VehicleAdminShortDto } from '../../../dtos/vehicleDto';

// interface Response {
//   limit: number;
//   offset: number;
//   rows: Array<VehicleDto>;
//   count: number;
// }

export class GetAdminVehicleByIdController extends BaseController {
  private useCase: GetAdminVehicleByIdUseCase;

  constructor(useCase: GetAdminVehicleByIdUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: GetAdminVehicleByIdRequestDto = {
        id: Number(request.path.id),
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const vehicle = result.value.getValue();

        return this.ok(VehicleMap.toAdminFullDto(vehicle));
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
