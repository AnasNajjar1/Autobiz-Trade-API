import { Import } from '../../domain/import';
import { IImportRepo } from '../importRepo';

export class InMemoryImportRepo implements IImportRepo {
  private mockedImport;

  public constructor(mock?: Import[]) {
    this.mockedImport = mock;
  }

  public async save(payload) {
    this.mockedImport.push(payload);
    return this.mockedImport.length;
  }

  public async update() {}

  public async getAdminImportByUuid() {}

  public async getAdminImportList(searchQuery) {
    const { filter } = searchQuery || {};

    const res = this.mockedImport.filter(
      (x) => x.createdBy === filter.createdBy,
    );
    return {
      count: res.length,
      limit: 25,
      offset: 0,
      rows: res,
    };
  }
}
