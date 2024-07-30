import { User } from '../domain/user';

export interface IUserRepo {
  exists(userId: number): Promise<Boolean>;
  getUserById(userId: number): Promise<User>;
  getUserByAutobizUserId(autobizUserId: string): Promise<User>;
  deleteUserById(userId: number): Promise<Boolean>;
  save(user: User): Promise<any>;
  getUsers(UserSearchQuery: {}): Promise<any>;
}
