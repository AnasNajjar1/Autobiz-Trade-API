export interface IImportQuotationRepo {
  getQuotationByReference(filter: {}): Promise<any>;
  getQuotationByVersion(filter: {}): Promise<any>;
}
