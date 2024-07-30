import { IGroupRepo } from '../groupRepo';
import { GroupMap } from '../../mappers/GroupMap';
import { Group, GroupProps } from '../../domain/group';

export class InMemoryGroupRepo implements IGroupRepo {
  private mockedGroups;

  public constructor(mock?: any[]) {
    this.mockedGroups = mock;
  }

  public getGroupById(id: number) {
    const group = this.mockedGroups.find((x) => x.id === id);
    if (!!group === false) throw new Error('group not found.');
    return Promise.resolve(GroupMap.toDomain(group));
  }

  public getGroupByName(name: string) {
    const group = this.mockedGroups.find((x) => x.name === name);
    if (!!group === false) throw new Error('group not found.');
    return Promise.resolve(GroupMap.toDomain(group));
  }

  public findOrCreate(name: string) {
    const group = this.mockedGroups.find((x) => x.name === name);
    if (!!group === false) throw new Error('group not found.');
    return Promise.resolve(GroupMap.toDomain(group));
  }

  public deleteGroupById(id: number) {
    const group = this.mockedGroups.find((x) => x.id === id);

    if (!group) {
      throw new Error('Group not found.');
    }

    this.mockedGroups = this.mockedGroups.filter((x) => x.id !== id);

    const found = this.mockedGroups.find((x) => x.id === id);

    if (found) {
      throw new Error('Group not deleted.');
    } else {
      return Promise.resolve(true);
    }
  }

  async exists(id: number): Promise<boolean> {
    const found = this.mockedGroups.find((x) => x.id === id);

    if (found) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }

  async save(group: Group) {
    let exists = false;
    const raw = await GroupMap.toPersistence(group);
    if (group.id) {
      exists = await this.exists(group.id);
    }

    if (exists) {
      return;
    } else {
      raw.id = this.mockedGroups.length + 1;
      this.mockedGroups.push(raw);

      return Promise.resolve(GroupMap.toDomain(raw));
    }
  }

  public getGroups(searchQuery: any) {
    const groups = this.mockedGroups;

    const result = {
      limit: 24,
      offset: 0,
      rows: groups.map((p) => GroupMap.toDomain(p)),
      count: this.mockedGroups.length,
    };

    return Promise.resolve(result);
  }
}
