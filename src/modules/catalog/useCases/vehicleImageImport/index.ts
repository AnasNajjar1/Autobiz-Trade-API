import { VehicleImageImportUseCase } from './VehicleImageImportUseCase';
import { fileService } from '../../../../infra/fileService';
import { vehicleRepo } from '../../repos';
import { maskRegistrationUseCase } from '../../../image/useCases/maskRegistration';
import { compressingVehicleMainPhotoUseCase } from '../vehicles/compressingVehicleMainPhoto';
import { importRepo } from '../../../fileImport/repos';

const vehicleImageImportUseCase = new VehicleImageImportUseCase(
  importRepo,
  fileService,
  vehicleRepo,
  maskRegistrationUseCase,
  compressingVehicleMainPhotoUseCase,
);

export { vehicleImageImportUseCase };
