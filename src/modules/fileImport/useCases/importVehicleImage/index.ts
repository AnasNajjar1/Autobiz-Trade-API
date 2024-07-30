import { ImportVehicleImageController } from './importVehicleImageController';
import { ImportVehicleImageUseCase } from './importVehicleImageUseCase';
import { fileService } from '../../../../infra/fileService';
import { importRepo } from '../../repos';
import { messengerService } from '../../../../infra/messenger';
const importUseCase = new ImportVehicleImageUseCase(
  fileService,
  importRepo,
  messengerService,
);
const importController = new ImportVehicleImageController(importUseCase);
const createImportVehicleImageHandler = (event) => {
  return importController.execute(event);
};

export { createImportVehicleImageHandler, importController, importUseCase };
