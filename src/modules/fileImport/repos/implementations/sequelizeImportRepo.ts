import { IImportRepo } from '../importRepo';
import { Op, fn, literal, col, where } from 'sequelize';
import { ImportMap } from '../../mappers/importMap';
import { Import } from '../../domain/import';
export class SequelizeImportRepo implements IImportRepo {
  private models: any;

  public constructor(models: any) {
    this.models = models;
  }

  async save(imports: any): Promise<any> {
    const row = ImportMap.toPersistence(imports);
    try {
      const { id } = await this.models.imports.create(row);
      return id;
    } catch (error) {
      console.warn(error);
      throw new Error('Import sequelize error.');
    }
  }

  public async update(
    notification: string,
    status: string,
    uuid: string,
  ): Promise<string> {
    const row = {};
    if (notification) {
      row['notification'] = notification;
    }
    if (status) {
      row['status'] = status;
    }
    await this.models.imports.update(row, { where: { uuid } });
    return uuid;
  }

  public async getAdminImportList(searchQuery?: any) {
    const { limit } = searchQuery || 12;
    const { offset } = searchQuery || 0;

    let { sortBy } = searchQuery || {};
    sortBy = sortBy ? sortBy : 'id';
    sortBy = sortBy.split('.').slice(-1);
    let { sortOrder } = searchQuery || {};
    sortOrder = sortOrder ? sortOrder : 'desc';

    const { filter } = searchQuery || {};
    const whereImport = {};

    const { uuid, id, status, createdBy, importType } = filter || {};

    if (uuid) {
      whereImport['uuid'] = uuid;
    }

    if (status) {
      whereImport['status'] = status;
    }
    if (importType) {
      whereImport['importType'] = importType;
    }
    if (createdBy) {
      whereImport['createdBy'] = createdBy;
    }

    if (id) {
      if (typeof id === 'string') {
        whereImport['id'] = id;
      }
      if (typeof id === 'object') {
        whereImport['id'] = {
          [Op.in]: id,
        };
      }
    }

    const query = await this.models.imports.findAndCountAll({
      limit,
      offset,
      where: whereImport,
      order: [[literal(sortBy + ' ' + sortOrder)]],
    });

    const pagination = {
      limit,
      offset,
      rows: query.rows.map((v) => ImportMap.toDomain(v)),
      count: query.count,
    };
    return pagination;
  }
  public async getAdminImportByUuid(uuid: string): Promise<Import> {
    const row = await this.models.imports.findOne({ where: { uuid } });
    return ImportMap.toDomain(row);
  }
}
