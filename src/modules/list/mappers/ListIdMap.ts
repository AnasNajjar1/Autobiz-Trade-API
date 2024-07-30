import { Mapper } from '../../../core/infra/Mapper';
import { List } from '../domain/list';

export class ListIdMap implements Mapper<any> {
  public static toDto(list: List) {
    return {
      id: list.id,
    };
  }
}
