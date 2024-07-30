import { GetImportRecordDetailUseCase } from './getImportRecordDetailUseCase';
import { GetImportRecordDetailController } from './getImportRecordDetailController';
import { importRecordRepo } from '../../repos';

const getImportRecordDetailUseCase = new GetImportRecordDetailUseCase(
  importRecordRepo,
);

const getImportRecordDetailController = new GetImportRecordDetailController(
  getImportRecordDetailUseCase,
);

export { getImportRecordDetailUseCase, getImportRecordDetailController };
