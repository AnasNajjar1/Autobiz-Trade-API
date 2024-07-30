import { CarcheckApiRepo } from './implementations/carcheckApiRepo';
import { QuotationApiRepo } from './implementations/quotationApiRepo';

const importRecordRepo = new CarcheckApiRepo();
const importQuotationRepo = new QuotationApiRepo();

export { importRecordRepo, importQuotationRepo };
