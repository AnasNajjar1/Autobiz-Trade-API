import { ImportRecordUseCase } from './ImportRecordUseCase';
import { ImportRecordController } from './ImportRecordController';
import { importQuotationRepo, importRecordRepo } from '../../repos';

const importRecordUseCase = new ImportRecordUseCase(
  importRecordRepo,
  importQuotationRepo,
);

const importRecordController = new ImportRecordController(importRecordUseCase);

const importRecordHandler = (event) => {
  return importRecordController.execute(event);
};

export { importRecordUseCase, importRecordController, importRecordHandler };
