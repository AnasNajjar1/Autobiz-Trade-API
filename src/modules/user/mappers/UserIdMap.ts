import { Mapper } from '../../../core/infra/Mapper';
import { User } from '../domain/user';

export class UserIdMap implements Mapper<any> {
  public static toDto(user: User) {
    return {
      id: user.id,
    };
  }
}
