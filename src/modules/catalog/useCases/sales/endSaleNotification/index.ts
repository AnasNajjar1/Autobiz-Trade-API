import { EndSaleNotificationUseCase } from './EndSaleNotificationUseCase';
import { EndSaleNotificationController } from './EndSaleNotificationController';
import { saleRepo } from '../../../repos';
import { messengerService } from '../../../../../infra/messenger';

const endSaleNotificationUseCase = new EndSaleNotificationUseCase(
  saleRepo,
  messengerService,
);

const endSaleNotificationController = new EndSaleNotificationController(
  endSaleNotificationUseCase,
);

const endSaleNotificationHandler = () => {
  return endSaleNotificationController.execute();
};

export { endSaleNotificationHandler };
