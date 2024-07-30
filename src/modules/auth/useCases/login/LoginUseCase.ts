import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { LoginRequestDto } from './LoginRequestDto';
import { LoginErrors } from './LoginErrors';
import { LoginResponseDto } from './LoginResponseDto';
import { IMessengerService } from '../../../../infra/messenger/MessengerService';
import { UuidUniqueEntityId } from '../../../../infra/uniqueIdentifier/uuidV4-uniqueIdentifier';
import { Log } from '../../../../infra/logger/LoggerService';
import { IApiUserService } from '../../../../infra/autobizApi/ApiUserService/IApiUserService';
import { getAwsToken } from '../../services/AuthService';

type Response = Either<
  AppError.UnexpectedError | LoginErrors.UsernameAndPasswordRequired,
  Result<LoginResponseDto>
>;

export class LoginUseCase
  implements UseCase<LoginRequestDto, Promise<Response>>
{
  private messenger: IMessengerService;
  private user: IApiUserService;

  constructor(messenger: IMessengerService, user: IApiUserService) {
    this.messenger = messenger;
    this.user = user;
  }

  public async execute(request: LoginRequestDto): Promise<Response> {
    const { username, password } = request;

    if (!(request.username && request.password)) {
      return left(new LoginErrors.UsernameAndPasswordRequired());
    }

    try {
      //get the token from autobiz to make sure that the user exist
      const autobizAuthOrError = await this.user.login(username, password);
      if (autobizAuthOrError.isLeft())
        return left(new LoginErrors.CannotLogin());

      const autobizAuth = autobizAuthOrError.value.getValue();

      // send logging notification
      const logFormated: Log = {
        createdAt: new Date().toISOString(),
        userId: autobizAuth.user.autobizUserId,
        uuid: new UuidUniqueEntityId().generate(),
        requestPath: '/auth',
        details: {
          path: { S: '/auth' },
          httpMethod: { S: 'POST' },
        },
      };

      await this.messenger.publishMessage('logCall', logFormated);

      const awsToken = await getAwsToken(autobizAuth.user.autobizUserId);

      return right(
        Result.ok<LoginResponseDto>({
          ...autobizAuth,
          awsIdentity: {
            ...awsToken,
            domain: 'developer',
          },
        }),
      );
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
