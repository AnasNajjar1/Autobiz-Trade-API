import { Mapper } from '../../../core/infra/Mapper';
import { Log } from '../domain/log';
import { LogDto } from '../dtos/logDto';

export class LogMap implements Mapper<Log> {
  public static toDomain(raw: any): Log {
    const logOrError = Log.create(
      {
        referenceTable: raw.referenceTable,
        referenceId: raw.referenceId,
        data: JSON.parse(raw.data),
        action: raw.action,
        user: raw.user,
        createdAt: raw.createdAt,
      },
      raw.id,
    );

    logOrError.isFailure ? console.warn(logOrError.error) : '';

    return logOrError.isSuccess ? logOrError.getValue() : null;
  }

  public static toDto(log: Log): LogDto {
    return {
      id: log.logId,
      referenceTable: log.referenceTable,
      referenceId: log.referenceId,
      data: log.data,
      user: log.user,
      action: log.action,
      createdAt: log.createdAt,
    };
  }

  public static toPersistence(log: Log): any {
    return {
      referenceTable: log.referenceTable,
      referenceId: log.referenceId,
      data: log.data,
      user: log.user,
      action: log.action,
    };
  }
}
