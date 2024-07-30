import { RepoPagination } from '../../../core/infra/Paginate';
import { List } from '../domain/list';

export interface IListRepo {
  exists(listId: number): Promise<Boolean>;
  getListById(listId: number): Promise<List>;
  getListByName(name: string): Promise<List>;
  deleteListById(listId: number): Promise<Boolean>;
  save(list: List): Promise<any>;
  getLists(ListSearchQuery: {}): Promise<RepoPagination<List>>;
  getOnlineListsByUser(userId: string): Promise<RepoPagination<List>>;
}
