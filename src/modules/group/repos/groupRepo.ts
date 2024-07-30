import { Group } from '../domain/group';

export interface IGroupRepo {
  exists(groupId: number): Promise<Boolean>;
  getGroupById(groupId: number): Promise<Group>;
  getGroupByName(name: string): Promise<Group>;
  findOrCreate(name: string): Promise<Group>;
  deleteGroupById(groupId: number): Promise<Boolean>;
  save(group: Group): Promise<Group>;
  getGroups(GroupSearchQuery: {}): Promise<any>;
}
