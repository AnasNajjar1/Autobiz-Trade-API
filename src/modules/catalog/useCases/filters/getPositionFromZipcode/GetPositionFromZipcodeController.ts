import { BaseController } from '../../../../../core/infra/BaseController';
import { GetPositionFromZipcodeUseCase } from './GetPositionFromZipcodeUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { GetPositionFromZipcodeRequestDto } from './GetPositionFromZipcodeRequestDto';
import { GetPositionFromZipcodeResponse } from './GetPositionFromZipcodeResponse';
import { GetPositionFromZipcodeErrors } from './GetPositionFromZipcodeErrors';

export class GetPositionFromZipcodeController extends BaseController {
  private useCase: GetPositionFromZipcodeUseCase;

  constructor(useCase: GetPositionFromZipcodeUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: GetPositionFromZipcodeRequestDto = {
      zipCode: request.body.zipCode,
      country: request.body.country,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const position = result.value.getValue();

        return this.ok<GetPositionFromZipcodeResponse>(position);
      } else {
        const error = result.value;

        switch (error.constructor) {
          case GetPositionFromZipcodeErrors.ZipcodeNotFoundError:
            return this.notFound(error.errorValue().message);
          default:
            return this.fail(result.value.errorValue().message);
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
