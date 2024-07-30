import { ILogRepo } from '../logRepo';
import { LogMap } from '../../mappers/LogMap';
import { SearchQuery } from '../../../../infra/http/HttpRequest';
import { Log } from '../../domain/log';

export class SequelizeLogRepo implements ILogRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  public async getLogs(searchQuery: SearchQuery) {
    const { limit, offset, sortBy, sortOrder, filter } = searchQuery;

    let where;

    const { referenceTable, referenceId, action } = filter;
    referenceTable ? (where = { ...{ referenceTable }, ...where }) : null;
    action ? (where = { ...{ action }, ...where }) : null;
    referenceId ? (where = { ...{ referenceId }, ...where }) : null;

    try {
      const query = await this.models.log.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
      });

      const pagination = {
        limit,
        offset,
        rows: query.rows.map((p) => LogMap.toDomain(p)),
        count: query.count,
      };

      return pagination;
    } catch (error) {
      throw new Error('Search Log failed.');
    }
  }
}
