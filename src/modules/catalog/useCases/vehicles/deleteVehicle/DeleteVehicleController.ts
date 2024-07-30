import { BaseController } from '../../../../../core/infra/BaseController';
import { DeleteVehicleUseCase } from './DeleteVehicleUseCase';
import { DeleteVehicleErrors } from './DeleteVehicleErrors';

interface Request {
  id: number;
  user: string;
}

export class DeleteVehicleController extends BaseController {
  private useCase: DeleteVehicleUseCase;

  constructor(useCase: DeleteVehicleUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: any): Promise<any> {
    const dto: Request = {
      id: request.path.id,
      user: request.user,
    } as Request;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case DeleteVehicleErrors.VehicleNotFoundError:
            return this.notFound(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        return this.ok(dto);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
