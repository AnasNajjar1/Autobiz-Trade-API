import { Pointofsale } from '../domain/pointofsale';

export interface IPointofsaleRepo {
  exists(pointofsaleId: number): Promise<Boolean>;
  getPointofsaleById(pointofsaleId: number): Promise<Pointofsale>;
  getPointofsaleByAutobizId(autobizId: string): Promise<Pointofsale>;
  getPointofsaleByUuid(uuid: string, userId: string): Promise<Pointofsale>;
  deletePointofsaleById(pointofsaleId: number): Promise<Boolean>;
  save(pointofsale: Pointofsale): Promise<any>;
  getPointofsales(PointofsaleSearchQuery: {}): Promise<any>;
  getOnlinePointofsalesListByUser(PointofsaleSearchQuery: {}): Promise<any>;
  findPointofsale(PointofsaleSearchQuery: {}): Promise<Pointofsale>;
}
