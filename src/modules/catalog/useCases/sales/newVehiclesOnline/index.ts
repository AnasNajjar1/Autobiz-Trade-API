import { NewVehiclesOnlineUseCase } from './NewVehiclesOnlineUseCase';
import { NewVehiclesOnlineController } from './NewVehiclesOnlineController';
import { saleRepo } from '../../../repos';
import { userRepo } from '../../../../user/repos';
import { messengerService } from '../../../../../infra/messenger';

const newVehiclesOnlineUseCase = new NewVehiclesOnlineUseCase(
  saleRepo,
  userRepo,
  messengerService,
);

const newVehiclesOnlineController = new NewVehiclesOnlineController(
  newVehiclesOnlineUseCase,
);

const newVehicleOnlineHandler = () => {
  return newVehiclesOnlineController.execute();
};

export { newVehicleOnlineHandler };
