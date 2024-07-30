import { LogoutUseCase } from './LogoutUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { LogoutRequestDto } from './LogoutRequestDto';
import { LogoutResponseDto } from './LogoutResponseDto';
import { LoggedController } from '../../../../core/infra/LoggedController';

export class LogoutController extends LoggedController {
  private useCase: LogoutUseCase;

  constructor(loggerService, useCase: LogoutUseCase) {
    super(loggerService);
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const { authorization } = request.headers;
      const dto: LogoutRequestDto = { token: authorization };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const response = result.value.getValue();
        return this.ok<LogoutResponseDto>(response);
      } else {
        const error = result.value;
        return this.fail(error.errorValue().message);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
