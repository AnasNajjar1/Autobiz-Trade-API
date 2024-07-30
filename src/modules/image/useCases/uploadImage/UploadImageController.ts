import { UploadImageUseCase } from './UploadImageUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { BaseController } from '../../../../core/infra/BaseController';
import { UploadImageRequestDto } from './UploadImageDto';

export class UploadImageController extends BaseController {
  private useCase: UploadImageUseCase;

  constructor(useCase: UploadImageUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: UploadImageRequestDto = {
        bucket: request.body.bucket,
        image: request.body.image,
      };
      const result = await this.useCase.execute(dto);
      console.log(result);
      if (result.isRight()) {
        const res = result.value.getValue();
        return this.ok(res);
      } else {
        const error = result.value;
        return this.fail(error.errorValue().message);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
