import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { NotifyAuctionFinishedErrors } from './NotifyAuctionFinishedErrors';
import { IMailerService } from '../../../../infra/mailer/mailerService';
import { EmailsMap } from '../../mappers/EmailsMap';
import { Request } from './NotifyAuctionFinishedRequestDto';
import { IApiUserService } from '../../../../infra/autobizApi/ApiUserService/IApiUserService';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class NotifyAuctionFinishedUseCase
  implements UseCase<Request, Promise<Response>> {
  private mailer: IMailerService;
  private apiUserService: IApiUserService;

  constructor(mailer: IMailerService, apiUserService: IApiUserService) {
    this.mailer = mailer;
    this.apiUserService = apiUserService;
  }

  public async execute(request: Request): Promise<Response> {
    await Promise.all([
      this.sendMailWinner(request),
      this.sendMailLoosers(request),
    ]);
    return right(Result.ok<any>(true));
  }

  private async sendMailWinner(sale: Request) {
    const { winner } = sale;
    if (!winner) {
      console.log('There is no winner on sale', sale.uuid);
      return;
    }
    const res = await this.apiUserService.getUserInfos(winner);
    if (res.isLeft())
      return left(
        new NotifyAuctionFinishedErrors.UserNotFoundExistsError(winner),
      );
    const winnerInfos = res.value.getValue();
    console.log('send winner mail to', winnerInfos.email);
    await this.mailer.sendMail(
      winnerInfos.email,
      EmailsMap.toSubjectWinnerSale(sale, winnerInfos.country),
      EmailsMap.toContentWinnerSale(sale, winnerInfos.country),
    );
  }

  private async sendMailLoosers(sale: Request) {
    const { offers, winner } = sale;
    if (!offers || offers === []) {
      console.log('There is no offers on sale', sale.uuid);
      return;
    }
    const loosers = [];
    offers.forEach(({ userId }) => {
      if (userId !== winner && !loosers.includes(userId)) loosers.push(userId);
    });
    return await Promise.all(
      loosers.map((looser) => this.sendMailLooser(looser, sale)),
    );
  }
  private async sendMailLooser(looser, sale: Request) {
    const res = await this.apiUserService.getUserInfos(looser);
    if (res.isLeft())
      return left(
        new NotifyAuctionFinishedErrors.UserNotFoundExistsError(looser),
      );
    const looserInfos = res.value.getValue();
    const { country } = looserInfos;
    console.log('send looser mail to', looserInfos.email);
    await this.mailer.sendMail(
      looserInfos.email,
      EmailsMap.toSubjectLooserSale(sale, country),
      EmailsMap.toContentLooserSale(sale, country),
    );
  }
}
