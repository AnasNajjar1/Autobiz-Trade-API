import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { LogoutRequestDto } from './LogoutRequestDto';
import { LogoutResponseDto } from './LogoutResponseDto';
import { IApiUserService } from '../../../../infra/autobizApi/ApiUserService/IApiUserService';
import { LogoutErrors } from './LogoutErrors';

type Response = Either<AppError.UnexpectedError, Result<LogoutResponseDto>>;

export class LogoutUseCase
  implements UseCase<LogoutRequestDto, Promise<Response>>
{
  private user: IApiUserService;

  constructor(user: IApiUserService) {
    this.user = user;
  }

  public async execute(request: LogoutRequestDto): Promise<Response> {
    try {
      const { token } = request;

      const logoutOrError = await this.user.logout(token);

      if (logoutOrError.isLeft()) return left(new LogoutErrors.CannotLogout());

      const logout = logoutOrError.value.getValue();
      return right(Result.ok<LogoutResponseDto>(logout));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
