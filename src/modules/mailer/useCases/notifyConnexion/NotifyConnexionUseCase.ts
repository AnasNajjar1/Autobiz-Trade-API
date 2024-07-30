import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { NotifyConnexionErrors } from './NotifyConnexionErrors';
import { IMailerService } from '../../../../infra/mailer/mailerService';
import { EmailsMap } from '../../mappers/EmailsMap';
import { Request } from './NotifyConnexionRequestDto';
import { IApiUserService } from '../../../../infra/autobizApi/ApiUserService/IApiUserService';

type Response = Either<AppError.UnexpectedError, Result<any>>;

const usersWithNoNotification = [
  'FR_1600408', //christophe
  'FR_1627650', //bruno
  'FR_1633811', //benoit
];
export class NotifyConnexionUseCase
  implements UseCase<Request, Promise<Response>> {
  private mailer: IMailerService;
  private apiUserService: IApiUserService;

  constructor(mailer: IMailerService, apiUserService: IApiUserService) {
    this.mailer = mailer;
    this.apiUserService = apiUserService;
  }

  public async execute(request: Request): Promise<Response> {
    const { userId } = request;

    if (usersWithNoNotification.includes(userId))
      return right(Result.ok<any>(`No notification for ${userId}`));

    const response = await this.apiUserService.getUserInfos(userId);

    if (response.isLeft()) {
      return left(
        new NotifyConnexionErrors.UserNotFoundExistsError(userId),
      ) as Response;
    }
    const user = response.value.getValue();

    if (user.email && user.email.includes('@autobiz.com'))
      return right(
        Result.ok<any>(`No notification for because it is autobiz${userId}`),
      );

    const content = EmailsMap.toContentConnexion(user, 'FR');
    const subject = EmailsMap.toSubjectConnexion(user, 'FR');
    await this.mailer.sendMail(process.env.emailReplyTo, subject, content);
    return right(Result.ok<any>(true));
  }
}
