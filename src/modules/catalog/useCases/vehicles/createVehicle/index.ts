import { CreateVehicleUseCase } from './CreateVehicleUseCase';
import { CreateVehicleController } from './CreateVehicleController';
import { vehicleRepo } from '../../../repos';
import { maskRegistrationListUseCase } from '../../../../image/useCases/maskRegistrationList';
import { messengerService } from '../../../../../infra/messenger';
const createVehicleUseCase = new CreateVehicleUseCase(
  vehicleRepo,
  maskRegistrationListUseCase,
  messengerService,
);

const createVehicleController = new CreateVehicleController(
  createVehicleUseCase,
);

const createVehicleHandler = (event) => {
  return createVehicleController.execute(event);
};

export { createVehicleUseCase, createVehicleController, createVehicleHandler };
