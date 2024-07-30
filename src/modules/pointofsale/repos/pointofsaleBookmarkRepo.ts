export interface IPointofsaleBookmarkRepo {
  add(uuid: string, userId: string): Promise<void>;
  remove(uuid: string, userId: string): Promise<void>;
}
