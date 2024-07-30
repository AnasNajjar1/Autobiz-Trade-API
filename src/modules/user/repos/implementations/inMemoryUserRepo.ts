import { IUserRepo } from '../userRepo';
import { UserMap } from '../../mappers/UserMap';
import { User, UserProps } from '../../domain/user';

export class InMemoryUserRepo implements IUserRepo {
  private mockedUsers;

  public constructor(mock?: any[]) {
    this.mockedUsers = mock;
  }

  public getUserById(id: number) {
    const user = this.mockedUsers.find((x) => x.id === id);
    if (!!user === false) throw new Error('user not found.');
    return Promise.resolve(UserMap.toDomain(user));
  }

  public getUserByAutobizUserId(autobizUserId: string) {
    const user = this.mockedUsers.find(
      (x) => x.autobizUserId === autobizUserId,
    );

    return Promise.resolve(UserMap.toDomain(user));
  }

  public deleteUserById(id: number) {
    const user = this.mockedUsers.find((x) => x.id === id);

    if (!user) {
      throw new Error('User not found.');
    }

    this.mockedUsers = this.mockedUsers.filter((x) => x.id !== id);

    const found = this.mockedUsers.find((x) => x.id === id);

    if (found) {
      throw new Error('User not deleted.');
    } else {
      return Promise.resolve(true);
    }
  }

  async exists(id: number): Promise<boolean> {
    const found = this.mockedUsers.find((x) => x.id === id);

    if (found) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }

  async save(user: User) {
    let exists = false;
    const raw = await UserMap.toPersistence(user);
    if (user.id) {
      exists = await this.exists(user.id);
    }

    if (exists) {
      return;
    } else {
      raw.id = this.mockedUsers.length + 1;
      this.mockedUsers.push(raw);

      return Promise.resolve(UserMap.toDomain(raw));
    }
  }

  public getUsers(searchQuery: any) {
    const users = this.mockedUsers;

    const result = {
      limit: 24,
      offset: 0,
      rows: users.map((p) => UserMap.toDomain(p)),
      count: this.mockedUsers.length,
    };

    return Promise.resolve(result);
  }
}
