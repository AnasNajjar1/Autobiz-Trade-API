export interface ISaleBookmarkRepo {
  add(uuid: string, userId: string): Promise<void>;
  remove(uuid: string, userId: string): Promise<void>;
}
