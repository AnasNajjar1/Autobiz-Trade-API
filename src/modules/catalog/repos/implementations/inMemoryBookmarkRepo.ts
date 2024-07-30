import { ISaleBookmarkRepo } from '../saleBookmarkRepo';

export class InMemorySaleBookmarkRepo implements ISaleBookmarkRepo {
  private mockedSaleBookmarks;

  public constructor(mock?: any) {
    this.mockedSaleBookmarks = mock;
  }

  public add(uuid: string, userId: string) {
    return Promise.resolve();
  }

  public remove(uuid: string, userId: string) {
    return Promise.resolve();
  }
}
