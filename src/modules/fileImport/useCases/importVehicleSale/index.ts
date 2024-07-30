import { ImportVehicleSaleController } from './importVehicleSaleController';
import { ImportVehicleSaleUseCase } from './importVehicleSaleUseCase';
import { fileService } from '../../../../infra/fileService';
import { importRepo } from '../../repos';
import { messengerService } from '../../../../infra/messenger';
const importUseCase = new ImportVehicleSaleUseCase(
  fileService,
  importRepo,
  messengerService,
);
const importController = new ImportVehicleSaleController(importUseCase);

const createImportVehicleSaleHandler = (event) => {
  return importController.execute(event);
};

export { createImportVehicleSaleHandler, importController, importUseCase };
