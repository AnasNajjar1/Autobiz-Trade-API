import { IPointofsaleBookmarkRepo } from '../pointofsaleBookmarkRepo';

export class InMemorySaleBookmarkRepo implements IPointofsaleBookmarkRepo {
  private mocked;

  public constructor(mock?: any) {
    this.mocked = mock;
  }

  public add(uuid: string, userId: string) {
    return Promise.resolve();
  }

  public remove(uuid: string, userId: string) {
    return Promise.resolve();
  }
}
