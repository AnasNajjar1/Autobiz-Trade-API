import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { RefreshTokenResponseDto } from './RefreshTokenResponseDto';
import { RefreshTokenRequestDto } from './RefreshTokenRequestDto';
import { IApiUserService } from '../../../../infra/autobizApi/ApiUserService/IApiUserService';
import { RefreshTokenErrors } from './RefreshTokenErrors';
import { getAwsToken } from '../../services/AuthService';

type Response = Either<
  AppError.UnexpectedError,
  Result<RefreshTokenResponseDto>
>;

export class RefreshTokenUseCase
  implements UseCase<RefreshTokenRequestDto, Promise<Response>>
{
  private user: IApiUserService;

  constructor(user: IApiUserService) {
    this.user = user;
  }

  public async execute(request: RefreshTokenRequestDto): Promise<Response> {
    try {
      const { refreshToken } = request;

      if (!refreshToken) {
        return left(new RefreshTokenErrors.RefreshTokenRequired());
      }

      //get the token from autobiz to make sure that the user exist
      const autobizAuthOrError = await this.user.refresh(refreshToken);

      if (autobizAuthOrError.isLeft())
        return left(new RefreshTokenErrors.CannotRefreshToken());

      const autobizAuth = autobizAuthOrError.value.getValue();

      const awsToken = await getAwsToken(autobizAuth.user.autobizUserId);

      return right(
        Result.ok<RefreshTokenResponseDto>({
          ...autobizAuth,
          awsIdentity: {
            ...awsToken,
            domain: 'developer',
          },
        }),
      );
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
