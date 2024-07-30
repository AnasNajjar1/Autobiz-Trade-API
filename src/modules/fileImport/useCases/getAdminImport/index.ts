import { GetAdminImportController } from './GetAdminImportController';
import { GetAdminImportUseCase } from './GetAdminImportUseCase';
import { importRepo } from '../../repos';

const getAdminImportUseCase = new GetAdminImportUseCase(importRepo);
const getAdminImportController = new GetAdminImportController(
  getAdminImportUseCase,
);
export const createAdminImportHandler = (event) => {
  return getAdminImportController.execute(event);
};
