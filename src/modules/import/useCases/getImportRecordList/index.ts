import { GetImportRecordListUseCase } from './GetImportRecordListUseCase';
import { GetImportRecordListController } from './GetImportRecordListController';
import { importRecordRepo } from '../../repos';

const getImportRecordListUseCase = new GetImportRecordListUseCase(
  importRecordRepo,
);

const getImportRecordListController = new GetImportRecordListController(
  getImportRecordListUseCase,
);

export { getImportRecordListUseCase, getImportRecordListController };
