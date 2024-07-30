export interface IImportRecordRepo {
  getRecordsList(filter: {}): Promise<any>;
  getRecordDetail(recordId: number): Promise<any>;
  getSource(sourceId: number): Promise<any>;
  getInspection(formId: number): Promise<any>;
  //getDocumenHistovec(documentType, documentName, recordId, mode): Promise<any>;
}
