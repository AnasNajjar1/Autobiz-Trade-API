import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { RefreshTokenUseCase } from './RefreshTokenUseCase';
import { RefreshTokenRequestDto } from './RefreshTokenRequestDto';
import { RefreshTokenResponseDto } from './RefreshTokenResponseDto';
import { BaseController } from '../../../../core/infra/BaseController';

export class RefreshTokenController extends BaseController {
  private useCase: RefreshTokenUseCase;

  constructor(useCase: RefreshTokenUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const refreshToken = request.headers['x-refresh-token'];

      const dto: RefreshTokenRequestDto = { refreshToken };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const response = result.value.getValue();
        return this.ok<RefreshTokenResponseDto>(response);
      } else {
        const error = result.value;
        return this.fail(error.errorValue().message);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
