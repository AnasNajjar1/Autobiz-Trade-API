import { IListRepo } from '../listRepo';
import { ListMap } from '../../mappers/ListMap';
import { List, ListProps } from '../../domain/list';

export class InMemoryListRepo implements IListRepo {
  private mockedLists;

  public constructor(mock: any[]) {
    this.mockedLists = mock;
  }

  public getListById(id: number) {
    const list = this.mockedLists.find((x) => x.id === id);
    if (!!list === false) throw new Error('list not found.');

    return Promise.resolve(ListMap.toDomain(list));
  }

  public getListByName(name: string) {
    const list = this.mockedLists.find((x) => x.name === name);

    return Promise.resolve(ListMap.toDomain(list));
  }

  public deleteListById(id: number) {
    const list = this.mockedLists.find((x) => x.id === id);

    if (!list) {
      throw new Error('List not found.');
    }

    this.mockedLists = this.mockedLists.filter((x) => x.id !== id);

    const found = this.mockedLists.find((x) => x.id === id);

    if (found) {
      throw new Error('List not deleted.');
    } else {
      return Promise.resolve(true);
    }
  }

  async exists(id: number): Promise<boolean> {
    const found = this.mockedLists.find((x) => x.id === id);

    if (found) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }

  async save(list: List) {
    let exists = false;
    const raw = await ListMap.toPersistence(list);
    if (list.id) {
      exists = await this.exists(list.id);
    }

    if (exists) {
      return;
    } else {
      raw.id = this.mockedLists.length + 1;
      this.mockedLists.push(raw);

      return Promise.resolve(ListMap.toDomain(raw));
    }
  }

  public getLists(searchQuery: any) {
    const lists = this.mockedLists;

    const result = {
      limit: 24,
      offset: 0,
      rows: lists.map((p) => ListMap.toDomain(p)),
      count: this.mockedLists.length,
    };

    return Promise.resolve(result);
  }

  public getOnlineListsByUser(userId: string) {
    const lists = this.mockedLists;

    const result = lists.map((p) => ListMap.toDomain(p));

    return Promise.resolve(result);
  }
}
