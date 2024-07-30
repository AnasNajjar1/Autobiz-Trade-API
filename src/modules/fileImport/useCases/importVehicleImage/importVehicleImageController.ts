import { BaseController } from '../../../../core/infra/BaseController';
import { ImportVehicleImageUseCase } from './importVehicleImageUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { CreateImportVehicleImageRequestDto } from './importVehicleImageRequestDto';

export class ImportVehicleImageController extends BaseController {
  private useCase: ImportVehicleImageUseCase;

  constructor(useCase: ImportVehicleImageUseCase) {
    super();
    this.useCase = useCase;
  }
  async executeImpl(request: HttpRequestDto): Promise<any> {
    const { link, uuid } = request.body;
    const dto: CreateImportVehicleImageRequestDto = {
      link,
      uuid,
      createdBy: request.user,
    };
    try {
      const result = await this.useCase.execute(dto);
      if (result.isRight()) {
        const id = result.value.getValue();
        return this.created({ id });
      } else {
        return this.fail(result.value.errorValue());
      }
    } catch (err) {
      return this.fail(err.msg);
    }
  }
}
