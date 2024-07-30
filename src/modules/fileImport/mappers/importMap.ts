import { Mapper } from '../../../core/infra/Mapper';
import { Import } from '../domain/import';

export class ImportMap implements Mapper<Import> {
  public static toDomain(raw: any): Import {
    const offerOrError = Import.create(
      {
        uuid: raw.uuid,
        status: raw.status,
        notification: raw.notification,
        link: raw.link,
        createdBy: raw.createdBy,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw?.id,
    );

    offerOrError.isFailure ? console.warn(offerOrError.error) : '';

    return offerOrError.isSuccess ? offerOrError.getValue() : null;
  }
  public static toPersistence(row: Import): any {
    return {
      id: row.id,
      uuid: row.uuid,
      status: row.status,
      notification: row.notification,
      link: row.link,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      importType: row.importType,
    };
  }
  public static toAdminFullDto(row: Import): any {
    return {
      id: row.id,
      uuid: row.uuid,
      status: row.status,
      notification: row.notification,
      link: row.link,
      createdBy: row.createdBy,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      importType: row.importType,
    };
  }
}
