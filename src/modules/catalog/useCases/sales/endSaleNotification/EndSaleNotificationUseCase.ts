import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { AppError } from '../../../../../core/logic/AppError';
import { UseCase } from '../../../../../core/logic/UseCase';
import { ISaleRepo } from '../../../repos/saleRepo';
import { IMessengerService } from '../../../../../infra/messenger/MessengerService';
import moment from 'moment';
import _ from 'lodash';
import { SaleMap } from '../../../mappers/SaleMap';
import { IOfferRepo } from '../../../repos/offerRepo';

type Response = Either<AppError.UnexpectedError, Result<string>>;

export class EndSaleNotificationUseCase
  implements UseCase<number, Promise<Response>> {
  private saleRepo: ISaleRepo;
  private messenger: IMessengerService;

  constructor(saleRepo: ISaleRepo, messenger: IMessengerService) {
    this.saleRepo = saleRepo;
    this.messenger = messenger;
  }

  public async execute(cronInterval: number): Promise<Response> {
    try {
      const maxTime = moment().set('second', 10).toISOString();
      const minTime = moment(maxTime)
        .subtract(cronInterval, 'minutes')
        .toISOString();
      const salesIds = await this.saleRepo.getSalesJustEnded([
        minTime,
        maxTime,
      ]);
      console.log('sales just ended', salesIds);
      await Promise.all(
        salesIds.map(async (id) => {
          const fullSale = await this.saleRepo.getSaleByIdWithOffers(id);
          await this.messenger.publishMessage(
            'endSaleNotification',
            SaleMap.toEndOfSaleNotificationDto(fullSale),
          );
        }),
      );
      return right(Result.ok('success'));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
