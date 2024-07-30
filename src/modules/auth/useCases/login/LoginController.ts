import { BaseController } from '../../../../core/infra/BaseController';
import { LoginUseCase } from './LoginUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { LoginRequestDto } from './LoginRequestDto';
import { LoginResponseDto } from './LoginResponseDto';

export class LoginController extends BaseController {
  private useCase: LoginUseCase;

  constructor(useCase: LoginUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const { username, password } = request.headers;
      const dto: LoginRequestDto = { username, password };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const response = result.value.getValue();
        return this.ok<LoginResponseDto>(response);
      } else {
        const error = result.value;
        return this.fail(error.errorValue().message);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
