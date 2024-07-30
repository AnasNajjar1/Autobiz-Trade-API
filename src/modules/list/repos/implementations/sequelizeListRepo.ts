import { IListRepo } from '../listRepo';
import { ListMap } from '../../mappers/ListMap';
import { List } from '../../domain/list';
import { Op, fn, literal, col } from 'sequelize';
import { RepoPagination } from '../../../../core/infra/Paginate';

export class SequelizeListRepo implements IListRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  private createBaseQuery() {
    return {
      distinct: 'list.id',
      include: [],
      where: {},
      limit: 24,
      offset: 0,
      order: [['id', 'DESC']],
    };
  }

  async exists(id: number): Promise<boolean> {
    const list = await this.models.list.findOne({
      where: {
        id,
      },
    });
    return !!list === true;
  }

  async getListById(id: number): Promise<List> {
    const baseQuery = this.createBaseQuery();
    baseQuery.include.push({
      model: this.models.sale,
      required: false,
    });
    baseQuery.where = { id };

    const list = await this.models.list.findOne(baseQuery);

    if (!!list === false) throw new Error('List not found.');
    return ListMap.toDomain(list);
  }

  async getListByName(name: string): Promise<List> {
    const baseQuery = this.createBaseQuery();
    baseQuery.where = { name };
    const list = await this.models.list.findOne(baseQuery);
    if (!!list === false) throw new Error('List not found.');
    return ListMap.toDomain(list);
  }

  async getOnlineListsByUser(userId: string): Promise<any> {
    const result = await this.models.list.findAll({
      include: [
        {
          attributes: [
            'id',
            'uuid',
            'supplyType',
            'startDateTime',
            'endDateTime',
          ],
          model: this.models.sale,
          include: [
            {
              model: this.models.salesStats,
              required: true,
              where: {
                status: {
                  [Op.and]: {
                    [Op.in]: ['LIVE', 'CLOSED'],
                    [Op.not]: null,
                  },
                },
              },
            },
            { attributes: ['brandLabel'], model: this.models.vehicle },
          ],
        },
      ],
      where: {
        [Op.and]: [
          literal(
            `(list.groupId IS NULL OR '${userId}' IN (
              SELECT autobizUserId
              FROM users AS u LEFT JOIN groupMembers gm ON (gm.userId = u.id )
              WHERE gm.groupId = list.groupId)
            )`,
          ),
        ],
      },
    });

    const pagination: RepoPagination<ListMap> = {
      limit: 0,
      offset: 100,
      rows: result.map((p) => ListMap.toDomain(p)),
      count: result.length,
    };

    return pagination;
  }

  async getLists(searchQuery?: any): Promise<any> {
    const baseQuery = this.createBaseQuery();

    if (searchQuery.sortBy && searchQuery.sortOrder) {
      baseQuery.order = [[searchQuery.sortBy, searchQuery.sortOrder]];
    }
    const result = await this.models.list.findAndCountAll(baseQuery);

    const pagination = {
      limit: baseQuery.limit,
      offset: baseQuery.offset,
      rows: result.rows.map((p) => ListMap.toDomain(p)),
      count: result.count,
    };

    return pagination;
  }

  async deleteListById(id: number): Promise<boolean> {
    const baseQuery = this.createBaseQuery();
    baseQuery.where['id'] = id;
    const deleted = await this.models.list.destroy(baseQuery);

    if (deleted !== 1) throw new Error('List not found.');

    return true;
  }

  async save(list: List): Promise<any> {
    const rawList = await ListMap.toPersistence(list);

    let exists: boolean = false;
    if (list?.id) {
      exists = await this.exists(list.id);
    }

    let sequelizeListModel;

    try {
      if (!exists) {
        sequelizeListModel = await this.models.list.create(rawList);
      } else {
        await this.models.list.update(rawList, {
          where: {
            id: list.id,
          },
        });

        sequelizeListModel = await this.models.list.findOne({
          where: { id: list.id },
        });
      }
    } catch (error) {
      console.warn(error);
      throw new Error('List sequelize error.');
    }

    return ListMap.toDomain(sequelizeListModel.dataValues);
  }
}
