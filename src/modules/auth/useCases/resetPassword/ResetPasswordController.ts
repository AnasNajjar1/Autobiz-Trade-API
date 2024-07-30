import { BaseController } from '../../../../core/infra/BaseController';
import { ResetPasswordUseCase } from './ResetPasswordUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { ResetPasswordRequestDto } from './ResetPasswordRequestDto';
import { ResetPasswordResponseDto } from './ResetPasswordResponseDto';

export class ResetPasswordController extends BaseController {
  private useCase: ResetPasswordUseCase;

  constructor(useCase: ResetPasswordUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {

      const { username } = request.body;
      const dto: ResetPasswordRequestDto = { username };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const response = result.value.getValue();
        return this.ok<ResetPasswordResponseDto>(response);
      } else {
        const error = result.value;
        return this.fail(error.errorValue().message);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}