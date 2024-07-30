import { FindOrCreateVehicleUseCase } from './findOrCreateVehicleUseCase';
import { vehicleRepo } from '../../../repos';

const findOrCreateVehicleUseCase = new FindOrCreateVehicleUseCase(vehicleRepo);

export { findOrCreateVehicleUseCase };
