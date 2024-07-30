import { Import } from '../domain/import';

export interface IImportRepo {
  save(row: any): Promise<any>;
  getAdminImportList(any: any): Promise<any>;
  getAdminImportByUuid(uuid: string): Promise<any>;
  update(notification: string, status: string, uuid: string): Promise<any>;
}
