import { SearchQuery } from '../../../infra/http/HttpRequest';

export interface ILogRepo {
  getLogs(searchQuery: SearchQuery): Promise<any>;
}
