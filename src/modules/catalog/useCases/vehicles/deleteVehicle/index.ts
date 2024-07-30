import { DeleteVehicleUseCase } from './DeleteVehicleUseCase';
import { DeleteVehicleController } from './DeleteVehicleController';
import { vehicleRepo } from '../../../repos';

const deleteVehicleUseCase = new DeleteVehicleUseCase(vehicleRepo);

const deleteVehicleController = new DeleteVehicleController(
  deleteVehicleUseCase,
);

const deleteVehicleHandler = (event) => {
  return deleteVehicleController.execute(event);
};

export { deleteVehicleUseCase, deleteVehicleController, deleteVehicleHandler };
