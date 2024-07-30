import { CronController } from '../../../../../core/infra/CronController';
import { EndSaleNotificationUseCase } from './EndSaleNotificationUseCase';

export class EndSaleNotificationController extends CronController {
  private useCase: EndSaleNotificationUseCase;

  constructor(useCase: EndSaleNotificationUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<any> {
    try {
      const scheduledCronHours = Number(process.env.cronAuctionFrequency);
      const result = await this.useCase.execute(scheduledCronHours);
      if (result.isRight()) {
        CronController.success('cron succeeded');
        return;
      } else {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(result.value.errorValue().message);
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
