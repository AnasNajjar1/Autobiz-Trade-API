import { IUserRepo } from '../userRepo';
import { UserMap } from '../../mappers/UserMap';
import { User } from '../../domain/user';
import { Op } from 'sequelize';

export class SequelizeUserRepo implements IUserRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  private createBaseQuery() {
    return {
      where: {},
      include: [
        {
          model: this.models.group,
          as: 'inGroups',
          attributes: ['id', 'name'],
        },
        {
          model: this.models.group,
          as: 'hasGroups',
          attributes: ['id', 'name'],
        },
      ],
      limit: 24,
      offset: 0,
      order: [['id', 'DESC']],
    };
  }

  async exists(id: number): Promise<boolean> {
    const user = await this.models.user.findOne({
      where: {
        id,
      },
    });
    return !!user === true;
  }

  async getUserById(id: number): Promise<User> {
    const baseQuery = this.createBaseQuery();
    baseQuery.where = { id };
    const user = await this.models.user.findOne(baseQuery);

    if (!!user === false) throw new Error('User not found.');

    return UserMap.toDomain(user);
  }

  async getUserByAutobizUserId(autobizUserId: string): Promise<User> {
    const baseQuery = this.createBaseQuery();
    baseQuery.where = { autobizUserId };
    const user = await this.models.user.findOne(baseQuery);
    if (!!user === false) throw new Error('User not found.');
    return UserMap.toDomain(user);
  }

  async getUsers(searchQuery: any): Promise<any> {
    const baseQuery = this.createBaseQuery();

    const { filter } = searchQuery || {};
    const where = {};

    const { q, id, groupMembers, groupOwners } = filter || {};

    if (q) {
      where['autobizUserId'] = {
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

    if (groupMembers) {
      baseQuery.include[0]['where'] = {
        id: filter.groupMembers,
      };
    }

    if (groupOwners) {
      baseQuery.include[1]['where'] = {
        id: filter.groupOwners,
      };
    }

    baseQuery.where = where;
    baseQuery.limit = searchQuery.limit;
    baseQuery.offset = searchQuery.offset;

    if (searchQuery.sortBy && searchQuery.sortOrder) {
      baseQuery.order = [[searchQuery.sortBy, searchQuery.sortOrder]];
    }

    const result = await this.models.user.findAndCountAll({
      ...baseQuery,
      distinct: true,
    });

    const pagination = {
      limit: baseQuery.limit,
      offset: baseQuery.offset,
      rows: result.rows.map((p) => UserMap.toDomain(p)),
      count: result.count,
    };

    return pagination;
  }

  async deleteUserById(id: number): Promise<boolean> {
    const baseQuery = this.createBaseQuery();
    baseQuery.where['id'] = id;
    const deleted = await this.models.user.destroy(baseQuery);

    if (deleted !== 1) throw new Error('User not found.');

    return true;
  }

  async save(user: User): Promise<any> {
    const rawUser = await UserMap.toPersistence(user);

    let exists: boolean = false;
    if (user?.id) {
      exists = await this.exists(user.id);
    }

    let sequelizeUserModel;

    try {
      if (!exists) {
        sequelizeUserModel = await this.models.user.create(rawUser);
      } else {
        await this.models.user.update(rawUser, {
          where: {
            id: user.id,
          },
        });

        sequelizeUserModel = await this.models.user.findOne({
          where: { id: user.id },
        });
      }

      if (user?.inGroups) {
        await sequelizeUserModel.setInGroups(user.inGroups.map((g) => g.id));
      }

      if (user?.hasGroups) {
        await sequelizeUserModel.setHasGroups(user.hasGroups.map((g) => g.id));
      }
    } catch (error) {
      console.warn(error);
      throw new Error('User sequelize error.');
    }

    return UserMap.toDomain(sequelizeUserModel.dataValues);
  }
}
