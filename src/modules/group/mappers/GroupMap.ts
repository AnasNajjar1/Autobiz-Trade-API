import { Mapper } from '../../../core/infra/Mapper';
import { Group } from '../domain/group';
import { GroupName } from '../domain/groupName';
import { GroupDto } from '../dtos/groupDto';

export class GroupMap implements Mapper<Group> {
  public static toDomain(raw: any): Group {
    const groupOrError = Group.create(
      {
        name: GroupName.create(raw.name).getValue(),
      },
      raw.id,
    );

    groupOrError.isFailure ? console.warn(groupOrError.error) : '';

    return groupOrError.isSuccess ? groupOrError.getValue() : null;
  }

  public static toDto(group: Group): GroupDto {
    return {
      id: group.id,
      name: group.name.value,
    };
  }

  public static async toPersistence(group: Group): Promise<any> {
    return {
      name: group.name.value,
    };
  }
}
