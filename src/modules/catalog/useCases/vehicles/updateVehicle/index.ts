import { UpdateVehicleUseCase } from './UpdateVehicleUseCase';
import { UpdateVehicleController } from './UpdateVehicleController';
import { vehicleRepo } from '../../../repos';
import { maskRegistrationListUseCase } from '../../../../image/useCases/maskRegistrationList';

const updateVehicleUseCase = new UpdateVehicleUseCase(
  vehicleRepo,
  maskRegistrationListUseCase,
);

const updateVehicleController = new UpdateVehicleController(
  updateVehicleUseCase,
);

const updateVehicleHandler = (event) => {
  return updateVehicleController.execute(event);
};

export { updateVehicleUseCase, updateVehicleController, updateVehicleHandler };
