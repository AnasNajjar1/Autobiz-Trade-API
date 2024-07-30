import { CronController } from '../../../../../core/infra/CronController';
import { NewVehiclesOnlineUseCase } from './NewVehiclesOnlineUseCase';

export class NewVehiclesOnlineController extends CronController {
  private useCase: NewVehiclesOnlineUseCase;

  constructor(useCase: NewVehiclesOnlineUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<any> {
    try {
      const result = await this.useCase.execute();
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
