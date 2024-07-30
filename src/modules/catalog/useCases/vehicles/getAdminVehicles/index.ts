import { GetAdminVehiclesUseCase } from './GetAdminVehiclesUseCase';
import { GetAdminVehiclesController } from './GetAdminVehiclesController';
import { vehicleRepo } from '../../../repos';

const getAdminVehiclesUseCase = new GetAdminVehiclesUseCase(vehicleRepo);

const getAdminVehiclesController = new GetAdminVehiclesController(
  getAdminVehiclesUseCase,
);

const getAdminVehiclesHandler = (event) => {
  return getAdminVehiclesController.execute(event);
};

export {
  getAdminVehiclesUseCase,
  getAdminVehiclesController,
  getAdminVehiclesHandler,
};
