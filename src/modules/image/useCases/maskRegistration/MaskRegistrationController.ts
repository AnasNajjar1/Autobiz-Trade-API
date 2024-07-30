import { BaseController } from '../../../../core/infra/BaseController';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { MaskRegistrationUseCase } from './MaskRegistrationUseCase';
import { MaskRegistrationRequestDto } from './MaskRegistrationRequestDto';
import { MaskRegistrationResponse } from './MaskRegistrationResponse';

export class MaskRegistrationController extends BaseController {
  private useCase: MaskRegistrationUseCase;

  constructor(useCase: MaskRegistrationUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: MaskRegistrationRequestDto = {
      url: request.body.key,
    };
    try {
      const result = await this.useCase.execute(dto);
      if (result.isRight()) {
        const answer = result.value.getValue;
        return this.ok<MaskRegistrationResponse>(answer);
      } else {
        const error = result.value;
        return error;
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
