import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { AssignedWinnerNotificationErrors } from './AssignedWinnerNotificationErrors';
import { IMailerService } from '../../../../infra/mailer/mailerService';
import { IApiUserService } from '../../../../infra/autobizApi/ApiUserService';
import { EmailsMap } from '../../mappers/EmailsMap';
import { Request } from './AssignedWinnerNotificationRequestDto';
import { CCmail } from './config';
type Response = Either<AppError.UnexpectedError, Result<any>>;

export class AssignedWinnerNotificationUseCase
  implements UseCase<Request, Promise<Response>>
{
  private mailer: IMailerService;
  private apiUserService: IApiUserService;

  constructor(mailer: IMailerService, apiUserService: IApiUserService) {
    this.mailer = mailer;
    this.apiUserService = apiUserService;
  }

  public async execute(request: Request): Promise<Response> {
    await this.sendMailWinner(request);
    return right(Result.ok<any>(request));
  }

  private async sendMailWinner(sale: Request) {
    const { winner } = sale;
    if (!winner) {
      console.log('There is no winner on sale', sale.uuid);
      return;
    }
    const userInfo = await this.apiUserService.getUserInfos(winner);
    if (userInfo.isLeft())
      return left(
        new AssignedWinnerNotificationErrors.UserNotFoundExistsError(winner),
      );
    if (sale.supplyType === 'STOCK') {
      await this.sendMailWinnerStock(sale, userInfo.value.getValue());
    } else {
      await this.sendMailWinnerOfferToPrivate(sale, userInfo.value.getValue());
    }
  }

  private async sendMailWinnerStock(sale: any, winnerInfos: any) {
    console.log('send winner mail to', winnerInfos.email);
    await this.mailer.sendMail(
      winnerInfos.email,
      EmailsMap.toSubjectWinnerSale(sale, winnerInfos.country),
      EmailsMap.toContentWinnerSale(sale, winnerInfos.country),
    );
  }

  private async sendMailWinnerOfferToPrivate(sale: any, winnerInfos: any) {
    console.log('send winner mail to', winnerInfos.email);
    await this.mailer.sendMail(
      winnerInfos.email,
      EmailsMap.toSubjectAssignedWinnerSale(winnerInfos.country),
      EmailsMap.toContentAssignedWinnerSale(sale, winnerInfos.country),
      winnerInfos.country === 'ES' ? CCmail : [],
    );
  }
}
