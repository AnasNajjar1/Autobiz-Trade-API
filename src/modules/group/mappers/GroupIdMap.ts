import { Mapper } from '../../../core/infra/Mapper';
import { Group } from '../domain/group';

export class GroupIdMap implements Mapper<any> {
  public static toDto(group: Group) {
    return {
      id: group.id,
    };
  }
}
