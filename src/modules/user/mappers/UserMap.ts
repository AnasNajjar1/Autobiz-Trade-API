import { Mapper } from '../../../core/infra/Mapper';
import { GroupMap } from '../../group/mappers/GroupMap';
import { User } from '../domain/user';
import { UserAutobizUserId } from '../domain/userAutobizUserId';
import { UserDto } from '../dtos/userDto';

export class UserMap implements Mapper<User> {
  public static toDomain(raw: any): User {
    const userOrError = User.create(
      {
        autobizUserId: UserAutobizUserId.create(raw.autobizUserId).getValue(),
        notificationDaily: raw.notificationDaily,
        notificationNewPush: raw.notificationNewPush,
        notificationAuction: raw.notificationAuction,
        inGroups: raw.inGroups
          ? raw.inGroups.map((t) => GroupMap.toDomain(t))
          : [],
        hasGroups: raw.hasGroups
          ? raw.hasGroups.map((t) => GroupMap.toDomain(t))
          : [],
      },
      raw.id,
    );

    userOrError.isFailure ? console.warn(userOrError.error) : '';

    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  public static toDto(user: User): UserDto {
    return {
      id: user.id,
      autobizUserId: user.autobizUserId.value,
      notificationDaily: user.notificationDaily,
      notificationNewPush: user.notificationNewPush,
      notificationAuction: user.notificationAuction,
      inGroups: user.inGroups.map((t) => GroupMap.toDto(t)),
      hasGroups: user.hasGroups.map((t) => GroupMap.toDto(t)),
    };
  }

  public static async toPersistence(user: User): Promise<any> {
    return {
      autobizUserId: user.autobizUserId.value,
      notificationDaily: user.notificationDaily,
      notificationNewPush: user.notificationNewPush,
      notificationAuction: user.notificationAuction,
    };
  }
}
