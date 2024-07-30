import { Mapper } from '../../../core/infra/Mapper';
import { Pointofsale } from '../domain/pointofsale';

export class PointofsaleIdMap implements Mapper<any> {
  public static toDto(pointofsale: Pointofsale) {
    return {
      id: pointofsale.id,
    };
  }
}
