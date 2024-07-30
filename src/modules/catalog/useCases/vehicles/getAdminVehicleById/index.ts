import { GetAdminVehicleByIdUseCase } from './GetAdminVehicleByIdUseCase';
import { GetAdminVehicleByIdController } from './GetAdminVehicleByIdController';
import { vehicleRepo } from '../../../repos';

const getAdminVehicleByIdUseCase = new GetAdminVehicleByIdUseCase(vehicleRepo);

const getAdminVehicleByIdController = new GetAdminVehicleByIdController(
  getAdminVehicleByIdUseCase,
);

const getAdminVehicleByIdHandler = (event) => {
  return getAdminVehicleByIdController.execute(event);
};

export {
  getAdminVehicleByIdUseCase,
  getAdminVehicleByIdController,
  getAdminVehicleByIdHandler,
};
