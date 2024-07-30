import { IGroupRepo } from '../groupRepo';
import { GroupMap } from '../../mappers/GroupMap';
import { Group } from '../../domain/group';
import { Op } from 'sequelize';
export class SequelizeGroupRepo implements IGroupRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  private createBaseQuery() {
    return {
      where: {},
      limit: 24,
      offset: 0,
      order: [['id', 'DESC']],
    };
  }

  async exists(id: number): Promise<boolean> {
    const group = await this.models.group.findOne({
      where: {
        id,
      },
    });
    return !!group === true;
  }

  async getGroupById(id: number): Promise<Group> {
    const group = await this.models.group.findOne({
      where: { id },
    });

    if (!!group === false) throw new Error('Group not found.');

    return GroupMap.toDomain(group);
  }

  async getGroupByName(name: string): Promise<Group> {
    const group = await this.models.group.findOne({
      where: { name },
    });

    if (!!group === false) throw new Error('Group not found.');

    return GroupMap.toDomain(group);
  }

  async findOrCreate(name: string): Promise<Group> {
    let group = await this.models.group.findOne({
      where: { name },
    });

    if (!!group === false) {
      group = this.models.group.create({ name });
    }

    return GroupMap.toDomain(group);
  }

  async getGroups(searchQuery: any): Promise<any> {
    const baseQuery = this.createBaseQuery();

    const where = {};

    const { q, name, id } = searchQuery.filter || {};

    if (name) {
      where['name'] = name;
    }

    if (q) {
      where['name'] = {
        [Op.substring]: q,
      };
    }

    if (id) {
      if (typeof id === 'string') {
        where['id'] = id;
      }
      if (typeof id === 'object') {
        where['id'] = {
          [Op.in]: id,
        };
      }
    }

    baseQuery.where = where;
    baseQuery.limit = searchQuery.limit;
    baseQuery.offset = searchQuery.offset;

    if (searchQuery.sortBy && searchQuery.sortOrder) {
      baseQuery.order = [[searchQuery.sortBy, searchQuery.sortOrder]];
    }

    const result = await this.models.group.findAndCountAll(baseQuery);

    const paginatedGroups = {
      limit: baseQuery.limit,
      offset: baseQuery.offset,
      rows: result.rows.map((p) => GroupMap.toDomain(p)),
      count: result.count,
    };

    return paginatedGroups;
  }

  async deleteGroupById(id: number): Promise<boolean> {
    const baseQuery = this.createBaseQuery();
    baseQuery.where['id'] = id;
    const deleted = await this.models.group.destroy(baseQuery);

    if (deleted !== 1) throw new Error('Group not found.');

    return true;
  }

  async save(group: Group): Promise<Group> {
    const rawSequelizeGroup = await GroupMap.toPersistence(group);

    let exists = false;
    if (group.id) {
      exists = await this.exists(group.id);
    }

    if (exists) {
      const updatedGroup = await this.models.group.update(rawSequelizeGroup, {
        where: {
          id: group.id,
        },
      });

      if (!!updatedGroup === false) {
        throw new Error('Group update sequelize error.');
      }
    } else {
      const createdGroup = await this.models.group.create(rawSequelizeGroup);
      if (!!createdGroup === false) {
        throw new Error('Group create sequelize error.');
      }

      return GroupMap.toDomain(createdGroup.dataValues);
    }
  }
}
