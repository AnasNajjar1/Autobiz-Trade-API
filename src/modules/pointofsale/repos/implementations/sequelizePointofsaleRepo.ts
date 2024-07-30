import { IPointofsaleRepo } from '../pointofsaleRepo';
import { PointofsaleMap } from '../../mappers/PointofsaleMap';
import { Pointofsale } from '../../domain/pointofsale';
import { BrandsOnline } from '../../dtos/pointofsaleDto';

import { Op, literal } from 'sequelize';
import { raw } from 'mysql';

export class SequelizePointofsaleRepo implements IPointofsaleRepo {
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
    const pointofsale = await this.models.pointofsale.findOne({
      where: {
        id,
      },
    });
    return !!pointofsale === true;
  }

  async getPointofsaleById(id: number): Promise<Pointofsale> {
    const baseQuery = this.createBaseQuery();
    baseQuery.where = { id };
    const pointofsale = await this.models.pointofsale.findOne(baseQuery);

    if (!!pointofsale === false) throw new Error('Pointofsale not found.');

    return PointofsaleMap.toDomain(pointofsale);
  }

  async getPointofsaleByAutobizId(autobizPosId: string): Promise<Pointofsale> {
    const baseQuery = this.createBaseQuery();
    baseQuery.where = { autobizPosId };
    const pointofsale = await this.models.pointofsale.findOne(baseQuery);

    if (pointofsale) {
      return PointofsaleMap.toDomain(pointofsale);
    } else {
      return null;
    }
  }

  async getPointofsaleByUuid(
    uuid: string,
    userId: string,
  ): Promise<Pointofsale> {
    try {
      let userGroup = [];
      const user = await this.models.user.findOne({
        where: { autobizUserId: userId },
        raw: true,
      });
      if (user) {
        userGroup = await this.models.groupmember.findAll({
          attributes: ['groupId'],
          where: { userId: user['id'] },
          raw: true,
        });
      }
      const result = await this.models.pointofsale.findAll({
        where: { uuid },
        include: [
          {
            attributes: ['id'],
            model: this.models.pointofsalebookmark,
            where: { userId },
            required: false,
          },
          {
            attributes: ['id', 'brandLabel'],
            model: this.models.vehicle,
            required: false,
            include: [
              {
                attributes: [],
                model: this.models.sale,
                required: true,
                where: {
                  [Op.or]: [
                    { groupId: null },
                    { groupId: userGroup.map((g) => g.groupId) },
                  ],
                },
                include: [
                  {
                    attributes: [],
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
                ],
              },
            ],
          },
        ],
      });
      const pointofsale = result[0];

      if (!!pointofsale === false) throw new Error('Pointofsale not found.');

      const brandsOnline = await this.getBrandsOnlineFromPointofsaleIdAndUserId(
        pointofsale.id,
        userId,
      );

      pointofsale.brandsOnline = brandsOnline;

      return PointofsaleMap.toDomain(pointofsale);
    } catch (error) {
      console.warn(error);
    }
  }

  async getBrandsOnlineFromPointofsaleIdAndUserId(
    pointofsaleId: number,
    userId: string,
  ): Promise<BrandsOnline[]> {
    const result = await this.models.sequelize.query(`
      SELECT v.brandLabel, COUNT(brandLabel) AS countVehicle
      FROM sales s
      LEFT JOIN vehicles v ON (s.vehicleId = v.id)
      LEFT JOIN salesStats ss ON (ss.saleId = s.id)
      WHERE v.pointOfSaleId = ${pointofsaleId}
      AND ss.status IN ('LIVE','CLOSED')
      AND s.groupId IS NULL OR '${userId}' IN (SELECT autobizUserId FROM users AS u LEFT JOIN groupMembers gm ON (gm.userId = u.id ) WHERE gm.groupId = s.groupId)
      GROUP BY v.brandLabel
    `);

    const brandsOnline: BrandsOnline[] = result[0];

    return brandsOnline;
  }
  async getPointofsales(searchQuery: any): Promise<any> {
    const baseQuery = this.createBaseQuery();

    const { filter } = searchQuery || {};
    const where = {};

    const { q, country, id ,company} = filter || {};

    if (country) {
      where['country'] = country;
    }

    if (q) {
      where['name'] = {
        [Op.substring]: q,
      };
    }

    if (id) {
      where['id'] = id;
    }

    if (company) {
      where['company'] = company;
    }

    baseQuery.where = where;
    baseQuery.limit = searchQuery.limit === 0 ? 25 : searchQuery.limit;
    baseQuery.offset = searchQuery.offset;

    if (searchQuery.sortBy && searchQuery.sortOrder) {
      baseQuery.order = [[searchQuery.sortBy, searchQuery.sortOrder]];
    }

    const result = await this.models.pointofsale.findAndCountAll(baseQuery);

    const pagination = {
      limit: baseQuery.limit,
      offset: baseQuery.offset,
      rows: result.rows.map((p) => PointofsaleMap.toDomain(p)),
      count: result.count,
    };

    return pagination;
  }

  async getOnlinePointofsalesListByUser(searchQuery?: any) {
    const { filter } = searchQuery || {};
    const { userId } = searchQuery || null;

    const { brandLabel, modelLabel, country, search, lat, lng, radius, list } =
      filter || {};

    const whereVehicle = {};
    const wherePointofsale = {};

    if (brandLabel) {
      whereVehicle['brandLabel'] = brandLabel;
    }

    if (modelLabel) {
      whereVehicle['modelLabel'] = modelLabel;
    }

    if (search) {
      wherePointofsale['name'] = {
        [Op.substring]: search,
      };
    }

    if (country && country != 'all') {
      wherePointofsale['country'] = country;
    }

    // Haversine formula search point of sales in a great-circle distance between two points on a sphere given their longitudes and latitudes
    if (lat && lng && radius) {
      wherePointofsale[Op.and] = literal(
        '(6371 * acos(cos(radians(' +
          lat +
          ')) * cos(radians(`pointofsale`.`latitude`)) * cos(radians(`pointofsale`.`longitude`) - radians(' +
          lng +
          ')) + sin(radians(' +
          lat +
          ')) * sin(radians(`pointofsale`.`latitude`)))) < ' +
          radius,
      );
    }

    const result = await this.models.pointofsale.findAndCountAll({
      distinct: 'pointofsale.id',
      attributes: [
        'id',
        'uuid',
        'name',
        'picture',
        'city',
        'zipCode',
        'country',
      ],
      where: wherePointofsale,
      include: [
        {
          attributes: ['id'],
          model: this.models.pointofsalebookmark,
          where: { userId },
          required: list === 'my_dealers' ? true : false,
        },
        {
          attributes: ['id', 'brandLabel'],
          model: this.models.vehicle,
          required: true,
          where: whereVehicle,
          include: [
            {
              attributes: [],
              model: this.models.sale,
              required: true,
              where: {
                [Op.and]: literal(
                  "(`vehicles->sale`.groupId IS NULL OR '" +
                    userId +
                    "' IN (SELECT autobizUserId FROM users AS u LEFT JOIN groupMembers gm ON (gm.userId = u.id ) WHERE gm.groupId = `vehicles->sale`.groupId))",
                ),
              },
              include: [
                {
                  attributes: [],
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
              ],
            },
          ],
        },
      ],
    });

    // for (const p of result.rows) {
    //   p.brandsOnline = await this.getBrandsOnlineFromPointofsaleIdAndUserId(
    //     p.id,
    //     searchQuery.userId,
    //   );
    // }

    const pagination = {
      limit: searchQuery.limit,
      offset: searchQuery.offset,
      rows: result.rows.map((p) => PointofsaleMap.toDomain(p)),
      count: result.count,
    };
    return pagination;
  }

  async deletePointofsaleById(id: number): Promise<boolean> {
    const baseQuery = this.createBaseQuery();
    baseQuery.where['id'] = id;
    const deleted = await this.models.pointofsale.destroy(baseQuery);

    if (deleted !== 1) throw new Error('Pointofsale not found.');

    return true;
  }

  async save(pointofsale: Pointofsale): Promise<any> {
    const rawPointofsale = await PointofsaleMap.toPersistence(pointofsale);

    let exists: boolean = false;
    if (pointofsale?.id) {
      const result = await this.models.pointofsale.findOne({
        where: {
          id: pointofsale.id,
        },
      });
      exists = !!result === true;
    }

    const whereAutobizPosId = {
      autobizPosId: pointofsale.autobizPosId
        ? pointofsale.autobizPosId.toString()
        : null,
    };

    if (pointofsale?.autobizPosId) {
      const result = await this.models.pointofsale.findOne({
        where: whereAutobizPosId,
      });
      exists = !!result === true;
    }

    let sequelizePointofsaleModel;

    try {
      if (!exists) {
        sequelizePointofsaleModel = await this.models.pointofsale.create(
          rawPointofsale,
        );
      } else {
        let where;
        pointofsale?.id ? (where = { id: pointofsale.id }) : {};
        pointofsale?.autobizPosId ? (where = whereAutobizPosId) : {};

        await this.models.pointofsale.update(rawPointofsale, {
          where: where,
        });

        sequelizePointofsaleModel = await this.models.pointofsale.findOne({
          where: where,
        });
      }
    } catch (error) {
      console.warn(error);
      throw new Error('Pointofsale sequelize error.');
    }

    return PointofsaleMap.toDomain(sequelizePointofsaleModel.dataValues);
  }

  async findPointofsale(searchQuery: any): Promise<Pointofsale> {
    let sequelizePointofsaleModel;
    try {
      const where = {};

      if (searchQuery.name) {
        where['name'] = searchQuery.name;
      }
      if (searchQuery.zipCode) {
        where['zipCode'] = searchQuery.zipCode;
      }
      if (searchQuery.country) {
        where['country'] = searchQuery.country;
      }
      if (searchQuery.city) {
        where['city'] = searchQuery.city;
      }
      sequelizePointofsaleModel = await this.models.pointofsale.findOne({
        where: where,
      });
    } catch (error) {
      console.warn(error, 'in getPointofsaleByName');
      throw new Error('Pointofsale sequelize error.');
    }
    if (sequelizePointofsaleModel) {
      return PointofsaleMap.toDomain(sequelizePointofsaleModel.dataValues);
    }

    return null;
  }
}
