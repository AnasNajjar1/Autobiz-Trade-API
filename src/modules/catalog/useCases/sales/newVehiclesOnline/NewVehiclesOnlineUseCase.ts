import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { AppError } from '../../../../../core/logic/AppError';
import { UseCase } from '../../../../../core/logic/UseCase';
import { ISaleRepo } from '../../../repos/saleRepo';
import { IUserRepo } from '../../../../user/repos/userRepo';
import { IMessengerService } from '../../../../../infra/messenger/MessengerService';
import { Request } from '../../../../mailer/useCases/notifyNewSales/NotifyNewSalesRequestDto';
import { SaleMap } from '../../../mappers/SaleMap';
import _ from 'lodash';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class NewVehiclesOnlineUseCase
  implements UseCase<number, Promise<Response>> {
  private saleRepo: ISaleRepo;
  private userRepo: IUserRepo;
  private messenger: IMessengerService;

  constructor(
    saleRepo: ISaleRepo,
    userRepo: IUserRepo,
    messenger: IMessengerService,
  ) {
    this.saleRepo = saleRepo;
    this.userRepo = userRepo;
    this.messenger = messenger;
  }

  public async execute(): Promise<Response> {
    try {
      const users = await this.userRepo.getUsers({ filter: '' });
      const sales = await this.saleRepo.getOnlineInStockSales();
      if (!sales) return right(Result.ok());

      const promises = _.map(users.rows, (user) =>
        this.sendMailToUser(user, sales),
      );
      await Promise.all(promises);

      return right(Result.ok());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }

  private async sendMailToUser(user, sales) {
    const { autobizUserId, notificationDaily, inGroups, country } = user;

    if (!notificationDaily) return;

    let userGroupsId = [0];
    userGroupsId = userGroupsId.concat(_.map(inGroups, '_id'));
    const userSales = this.filterSales(sales, userGroupsId, country);

    if (_.isEmpty(userSales)) return;

    const dataForNotification: Request = {
      userId: autobizUserId.value,
      sales: userSales.map((s) => SaleMap.toSaleNotificationDto(s)),
    };
    await this.messenger.publishMessage('newVehicles', dataForNotification);
  }

  private filterSales(sales, userGroupsId, userCountry) {
    return _.filter(sales, (sale) => {
      const pointOfSaleCountry =
        sale.vehicle.pointofsale?.country?.value ||
        sale.vehicle.pointofsale?.country;
      return (
        userGroupsId.includes(sale.groupId || 0) &&
        pointOfSaleCountry.toUpperCase() === userCountry
      );
    });
  }
}
