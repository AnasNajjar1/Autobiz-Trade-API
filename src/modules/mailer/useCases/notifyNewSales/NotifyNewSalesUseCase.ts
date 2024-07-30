import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { NotifyNewSalesErrors } from './NotifyNewSalesErrors';
import { IMailerService } from '../../../../infra/mailer/mailerService';
import { IApiUserService } from '../../../../infra/autobizApi/ApiUserService/IApiUserService';
import { EmailsMap } from '../../mappers/EmailsMap';
import { Request } from './NotifyNewSalesRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class NotifyNewSalesUseCase
  implements UseCase<Request, Promise<Response>> {
  private mailer: IMailerService;
  private apiUserService: IApiUserService;

  constructor(mailer: IMailerService, apiUserService: IApiUserService) {
    this.mailer = mailer;
    this.apiUserService = apiUserService;
  }

  public async execute(request: Request): Promise<Response> {
    const { userId } = request;
    const response = await this.apiUserService.getUserInfos(userId);

    if (response.isLeft()) {
      return left(
        new NotifyNewSalesErrors.UserNotFoundExistsError(userId),
      ) as Response;
    }
    const user = response.value.getValue();
    const content = EmailsMap.toContentNewVehicle(request.sales, user.country);
    const subject = EmailsMap.toSubjectNewVehicle(user.country);
    await this.mailer.sendMail(user.email, subject, content);
    return right(Result.ok<any>(true));
  }
}
