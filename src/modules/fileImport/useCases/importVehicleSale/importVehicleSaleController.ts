import { BaseController } from '../../../../core/infra/BaseController';
import { ImportVehicleSaleUseCase } from './importVehicleSaleUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { CreateImportVehicleSaleRequestDto } from './importVehicleSaleRequestDto';
import { v4 as uuidv4 } from 'uuid';

export class ImportVehicleSaleController extends BaseController {
  private useCase: ImportVehicleSaleUseCase;

  constructor(useCase: ImportVehicleSaleUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const { fileBase64 } = request.body;
    const uuid = uuidv4();
    const dto: CreateImportVehicleSaleRequestDto = {
      file: Buffer.from(
        fileBase64.replace(/data:application.+base64,/, ''),
        'base64',
      ),
      createdBy: request.user,
      uuid,
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
