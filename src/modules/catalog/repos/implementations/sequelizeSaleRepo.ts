import { ISaleRepo } from '../saleRepo';
import { SaleMap } from '../../mappers/SaleMap';
import { Sale } from '../../domain/sale';

import { Op, literal, where } from 'sequelize';
import _ from 'lodash';
import { combinations } from '../../../../shared/helpers/others/StringCombinations';
import {
  formatRegistration,
  formatRegistrationWithoutDash,
} from '../../../../shared/helpers/VehicleHelper';

export class SequelizeSaleRepo implements ISaleRepo {
  private mockedSales;
  private models: any;

  public constructor(models: any) {
    this.models = models;
  }

  public async getAdminSalesList(searchQuery?: any): Promise<any> {
    const { filter } = searchQuery || {};

    const whereVehicle = {};
    const whereSale = {};
    const whereStats = {};
    const wherePointofsale = {};

    const {
      vehicleId,
      fileNumberLike,
      registrationLike,
      listId,
      status,
      supplyType,
      saleId,
      startDateTimeMin,
      endDateTimeMax,
      validationStatus,
      createdAtInterval,
      groupId,
      country,
      id,
    } = filter || {};
    if (createdAtInterval) {
      whereSale['createdAt'] = {
        [Op.between]: createdAtInterval,
      };
    }

    if (vehicleId) {
      whereVehicle['id'] = vehicleId;
    }

    if (fileNumberLike) {
      whereVehicle['fileNumber'] = {
        [Op.substring]: fileNumberLike,
      };
    }

    if (registrationLike) {
      whereVehicle['registration'] = {
        [Op.or]: [
          { [Op.substring]: registrationLike },
          {
            [Op.substring]: formatRegistration('XX-XXX-XX', registrationLike),
          },
          {
            [Op.substring]: formatRegistrationWithoutDash(registrationLike),
          },
        ],
      };
    }

    if (validationStatus) {
      whereSale['validationStatus'] = validationStatus;
    }

    if (startDateTimeMin) {
      whereSale['startDateTime'] = {
        [Op.gte]: startDateTimeMin,
      };
    }

    if (endDateTimeMax) {
      whereSale['endDateTime'] = {
        [Op.lte]: endDateTimeMax,
      };
    }
    if (country) {
      wherePointofsale['country'] = country;
    }

    const order = [
      [
        literal(
          searchQuery.sortBy.split('.').slice(-1) + ' ' + searchQuery.sortOrder,
        ),
      ],
    ];

    if (status) {
      if (typeof status === 'string') {
        whereStats['status'] = status;
      }
      if (typeof status === 'object') {
        whereStats['status'] = {
          [Op.in]: status,
        };
      }
    }

    if (groupId) {
      whereSale['groupId'] = groupId;
    }

    if (listId) {
      whereSale['listId'] = listId;
    }

    if (saleId) {
      if (typeof saleId === 'string') {
        whereSale['id'] = saleId;
      }
      if (typeof saleId === 'object') {
        whereSale['id'] = {
          [Op.in]: saleId,
        };
      }
    }

    if (supplyType) {
      if (typeof supplyType === 'string') {
        whereSale['supplyType'] = supplyType;
      }
      if (typeof supplyType === 'object') {
        whereSale['supplyType'] = {
          [Op.in]: supplyType,
        };
      }
    }

    if (id) {
      whereSale['id'] = id;
    }

    const vehicleAttributes = [
      'id',
      'uuid',
      'fileNumber',
      'registration',
      'brandLabel',
      'modelLabel',
      'versionLabel',
      'firstRegistrationDate',
      'fuelLabel',
      'mileage',
      'carPictures',
      'profileBodyCosts',
      'pointOfSaleId',
      'salesSpeedName',
      'dpaProAmt',
      'standardMileage',
      'b2cMarketValue',
    ];

    const pointofsaleAttributes = [
      'uuid',
      'name',
      'city',
      'zipCode',
      'country',
    ];

    const query = {
      distinct: 'sale.id',
      where: whereSale,
      include: [
        { model: this.models.salesStats, where: whereStats },
        { model: this.models.saleoffer },
        { model: this.models.user },
        {
          attributes: ['name'],
          required: false,
          model: this.models.group,
          where: { id: literal('sale.groupId') },
        },
        {
          attributes: vehicleAttributes,
          model: this.models.vehicle,
          where: whereVehicle,
          include: [
            {
              attributes: pointofsaleAttributes,
              model: this.models.pointofsale,
              where: wherePointofsale,
            },
          ],
        },
      ],
      limit: searchQuery.limit ? searchQuery.limit : 100,
      offset: searchQuery.offset ? searchQuery.offset : 0,
      order,
    };
    const result = await this.models.sale.findAndCountAll(query);
    const sales = result.rows.map((p) => SaleMap.toDomain(p));

    const pagination = {
      limit: searchQuery.limit,
      offset: searchQuery.offset,
      rows: sales,
      count: result.count,
    };

    return pagination;
  }

  public async searchSalesPublic(
    searchQuery?: any,
    attributes = 'FULL',
  ): Promise<any> {
    const { limit, offset, filter, userId } = searchQuery || {};

    const whereVehicle = {};
    const whereSale = {};
    const whereStats = {};
    const wherePointofsale = {};
    let order;
    let includeBookmark;

    const {
      vehicleId,
      listId,
      status,
      supplyType,
      brandLabel,
      modelLabel,
      country,
      yearMecMin,
      yearMecMax,
      mileageMin,
      mileageMax,
      search,
      lat,
      lng,
      radius,
      saleId,
      saleUuid,
      pointOfSaleUuid,
      pointOfSaleId,
      saleTypeAccept,
    } = filter || {};

    if (vehicleId) {
      whereVehicle['id'] = vehicleId;
    }

    if (brandLabel) {
      whereVehicle['brandLabel'] = brandLabel;
    }

    if (modelLabel) {
      whereVehicle['modelLabel'] = modelLabel;
    }

    if (status) {
      if (typeof status === 'string') {
        whereStats['status'] = status;
      }
      if (typeof status === 'object') {
        whereStats['status'] = {
          [Op.in]: status,
        };
      }
    }

    if (yearMecMin && yearMecMax) {
      whereVehicle['firstRegistrationDate'] = {
        [Op.between]: [`${yearMecMin}-01-01`, `${yearMecMax}-12-31`],
      };
    } else if (!yearMecMin && yearMecMax) {
      whereVehicle['firstRegistrationDate'] = {
        [Op.between]: [`1970-01-01`, `${yearMecMax}-12-31`],
      };
    } else if (yearMecMin && !yearMecMax) {
      whereVehicle['firstRegistrationDate'] = {
        [Op.between]: [`${yearMecMin}-01-01`, `2050-12-31`],
      };
    }

    if (mileageMin && mileageMax) {
      whereVehicle['mileage'] = {
        [Op.between]: [mileageMin, mileageMax],
      };
    } else if (!mileageMin && mileageMax) {
      whereVehicle['mileage'] = {
        [Op.between]: [0, mileageMax],
      };
    } else if (mileageMin && !mileageMax) {
      whereVehicle['mileage'] = {
        [Op.between]: [mileageMin, 9999999],
      };
    }

    if (search) {
      whereVehicle[Op.and] = literal(
        `MATCH (vehicle.fileNumber, vehicle.brandLabel, vehicle.modelLabel, vehicle.versionLabel) AGAINST ('${search}')`,
      );
    }

    if (country) {
      wherePointofsale['country'] = country;
    }

    if (pointOfSaleUuid) {
      wherePointofsale['uuid'] = pointOfSaleUuid;
    }

    if (pointOfSaleId) {
      wherePointofsale['id'] = pointOfSaleId;
    }
    if (userId) {
      whereSale[Op.and] = literal(
        `(sale.groupId IS NULL OR '${userId}' IN (SELECT autobizUserId FROM users AS u LEFT JOIN groupMembers gm ON (gm.userId = u.id ) WHERE gm.groupId = sale.groupId))`,
      );

      includeBookmark = {
        attributes: ['id'],
        model: this.models.salebookmark,
        where: { userId },
        required: false,
      };
    } else {
      whereSale[Op.and] = literal(`(sale.groupId IS NULL)`); // Can be used for non authentified users
    }

    if (searchQuery.sortBy && searchQuery.sortOrder) {
      switch (searchQuery.sortBy) {
        // vehicles with sales scheduled and sales closed at the end
        case 'secondsBeforeEnd':
          order = [
            literal(
              'case when `salesStat.secondsBeforeEnd` <= 0 then 2 when `salesStat.secondsBeforeStart` > 0 then 1 ELSE 0 END, `salesStat.secondsBeforeEnd`' +
                searchQuery.sortOrder,
            ),
          ];
          break;
        case 'mileage':
          // vehicles without mileage are considered as very ~kilometred~
          order = [
            literal(
              'case when `vehicle.mileage` is null then 2 when `vehicle.mileage` < 0 then 1 ELSE 0 END, `vehicle.mileage` ' +
                searchQuery.sortOrder,
            ),
          ];
          break;
        default:
        case 'sellingPrice':
          order = [
            literal(
              'CASE WHEN `sale`.`acceptauction` = 1 THEN `sale`.`auctionstartprice`' +
                'WHEN `sale`.`acceptImmediatePurchase` = 1 AND `sale`.`acceptAuction` = 0 THEN `sale`.`immediatepurchaseprice` END ' +
                searchQuery.sortOrder,
            ),
          ];
          break;
      }
    }

    // Haversine formula search point of sales in a great-circle distance between two points on a sphere given their longitudes and latitudes
    if (lat && lng && radius) {
      wherePointofsale[Op.and] = literal(
        '(6371 * acos(cos(radians(' +
          lat +
          ')) * cos(radians(`vehicle->pointofsale`.`latitude`)) * cos(radians(`vehicle->pointofsale`.`longitude`) - radians(' +
          lng +
          ')) + sin(radians(' +
          lat +
          ')) * sin(radians(`vehicle->pointofsale`.`latitude`)))) < ' +
          radius,
      );
    }

    if (listId) {
      whereSale['listId'] = listId;
    }

    if (saleId) {
      if (typeof saleId === 'string') {
        whereSale['id'] = saleId;
      }
      if (typeof saleId === 'object') {
        whereSale['id'] = {
          [Op.in]: saleId,
        };
      }
    }

    if (saleUuid) {
      whereSale['uuid'] = saleUuid;
    }

    if (supplyType) {
      if (typeof supplyType === 'string') {
        whereSale['supplyType'] = supplyType;
      }
      if (typeof supplyType === 'object') {
        whereSale['supplyType'] = {
          [Op.in]: supplyType,
        };
      }
    }

    if (saleTypeAccept) {
      whereSale[saleTypeAccept] = 1;
    }

    let vehicleAttributes;
    let pointofsaleAttributes;
    if (attributes === 'SHORT') {
      vehicleAttributes = [
        'id',
        'uuid',
        'fileNumber',
        'registration',
        'brandLabel',
        'modelLabel',
        'versionLabel',
        'firstRegistrationDate',
        'fuelLabel',
        'mileage',
        'carPictures',
        'profileBodyCosts',
        'pointOfSaleId',
      ];

      pointofsaleAttributes = ['uuid', 'name', 'city', 'zipCode', 'country'];
    }

    const query = {
      distinct: 'sale.id',
      where: whereSale,
      include: [
        { model: this.models.salesStats, where: whereStats },
        { model: this.models.saleoffer },
        { model: this.models.user },

        {
          attributes: vehicleAttributes,
          model: this.models.vehicle,
          where: whereVehicle,
          required: true,
          include: [
            {
              attributes: pointofsaleAttributes,
              model: this.models.pointofsale,
              where: wherePointofsale,
              required: wherePointofsale ? true : false,
            },
          ],
        },
      ],
      order,
    };

    if (offset) query['offset'] = searchQuery.offset ? searchQuery.offset : 0;
    if (limit) query['limit'] = searchQuery.limit ? searchQuery.limit : 100;

    if (includeBookmark) {
      query.include.push(includeBookmark);
    }

    const result = await this.models.sale.findAndCountAll(query);
    let sales = result.rows.map((p) => {
      const sale: Sale = SaleMap.toDomain(p);
      sale.calculateUserInfo(userId);
      return sale;
    });
    // order scheduled sales by secondsBeforeStart
    if (searchQuery.sortOrder && searchQuery.sortBy === 'secondsBeforeEnd') {
      sales = this.reorderOnlineSales(sales);
    }

    const pagination = {
      limit: searchQuery.limit,
      offset: searchQuery.offset,
      rows: sales,
      count: result.count,
    };

    return pagination;
  }

  public async getSaleById(id: number): Promise<Sale> {
    const sale = await this.models.sale.findOne({
      include: [
        {
          model: this.models.vehicle,
          include: [{ model: this.models.pointofsale }],
        },
        {
          model: this.models.salesStats,
        },
      ],
      where: { id },
    });

    if (!!sale === false) throw new Error('Sale not found.');
    return SaleMap.toDomain(sale);
  }

  public async getSaleByIdWithOffers(id: number): Promise<Sale> {
    const sale = await this.models.sale.findOne({
      include: [
        {
          model: this.models.vehicle,
          include: [{ model: this.models.pointofsale }],
        },
        {
          model: this.models.saleoffer,
          where: { saleId: id },
        },
        {
          model: this.models.salesStats,
        },
      ],
      where: { id },
    });

    if (!!sale === false) throw new Error('Sale not found.');
    return SaleMap.toDomain(sale);
  }

  public async getOnlineSalesList(searchQuery?: any) {
    const {
      vehicleId,
      listId,
      supplyType,
      brandLabel,
      modelLabel,
      country,
      yearMecMin,
      yearMecMax,
      mileageMin,
      mileageMax,
      search,
      lat,
      lng,
      radius,
      saleId,
      saleUuid,
      pointOfSaleUuid,
      pointOfSaleId,
      saleTypeAccept,
    } = searchQuery.filter || {};
    const { userId, limit, offset } = searchQuery || {};
    let order;
    if (searchQuery.sortBy && searchQuery.sortOrder) {
      switch (searchQuery.sortBy) {
        // vehicles with sales scheduled and sales closed at the end
        case 'secondsBeforeEnd':
          order =
            'case when `salesStatSecondsBeforeEnd` <= 0 then 2 when `salesStatSecondsBeforeStart` > 0 then 1 ELSE 0 END, `salesStatSecondsBeforeEnd`' +
            searchQuery.sortOrder;
          break;
        case 'mileage':
          // vehicles without mileage are considered as very ~kilometred~
          order =
            'case when `vehicleMileage` is null then 2 when `vehicleMileage` < 0 then 1 ELSE 0 END, `vehicleMileage` ' +
            searchQuery.sortOrder;
          break;
        default:
        case 'sellingPrice':
          order = `CASE WHEN onlineSales.acceptAuction = 1 THEN onlineSales.auctionStartPrice
          WHEN onlineSales.acceptImmediatePurchase = 1 AND onlineSales.acceptAuction = 0 THEN onlineSales.immediatePurchasePrice
          END ${searchQuery.sortOrder}`;
          break;
      }
    }

    let where = '';

    if (supplyType) {
      where += `AND supplyType = '${supplyType}'`;
    }

    if (vehicleId) {
      where += `AND vehicleId = '${vehicleId}'`;
    }

    if (listId) {
      where += `AND listId = '${listId}'`;
    }

    if (brandLabel) {
      where += `AND vehicleBrandLabel = '${brandLabel}'`;
    }

    if (modelLabel) {
      where += `AND vehicleModelLabel = '${modelLabel}'`;
    }

    if (country) {
      country.length > 1
        ? (where += `AND pointOfSaleCountry IN(:country)`)
        : (where += `AND pointOfSaleCountry = '${country}'`);
    }

    if (yearMecMin) {
      where += `AND vehicleFirstRegistrationDate >= '${yearMecMin}-01-01'`;
    }

    if (yearMecMax) {
      where += `AND vehicleFirstRegistrationDate <= '${yearMecMax}-12-31'`;
    }

    if (mileageMin) {
      where += `AND vehicleMileage >= '${mileageMin}'`;
    }

    if (mileageMax) {
      where += `AND vehicleMileage <= '${mileageMax}'`;
    }

    if (search) {
      let matches = '';
      const searched = [];
      combinations(search.replace(/[^a-z0-9-.]/gi, ' ').split(' ')).forEach(
        (word) => {
          if (word.length > 0)
            searched.push(
              `"% ${word}"`,
              `"${word} %"`,
              `"% ${word} %"`,
              `"${word}"`,
            );
        },
      );
      searched.forEach((word) => {
        matches += `vehicleFileNumber LIKE ${word} OR vehicleVersionLabel LIKE ${word} OR vehicleModelLabel LIKE ${word} OR vehicleBrandLabel LIKE ${word} OR `;
      });
      if (matches.length > 0)
        where += `AND (${matches.slice(0, matches.length - 3)})`;
    }

    if (saleId) {
      where += `AND id = '${saleId}'`;
    }

    if (saleUuid) {
      where += `AND uuid = '${saleUuid}'`;
    }

    if (pointOfSaleId) {
      where += `AND pointOfSaleId = '${pointOfSaleId}'`;
    }

    if (pointOfSaleUuid) {
      where += `AND pointOfSaleUuid = '${pointOfSaleUuid}'`;
    }

    if (saleTypeAccept) {
      where += `AND ${saleTypeAccept} = 1 `;
    }

    if (lat && lng && radius) {
      where +=
        ` AND (6371 * acos(cos(radians(` +
        lat +
        `)) * cos(radians(pointOfSaleLatitude)) * cos(radians(pointOfSaleLongitude) - radians(` +
        lng +
        `)) + sin(radians(` +
        lat +
        `)) * sin(radians(pointOfSaleLatitude)))) < ` +
        radius;
    }

    let countQuery = `select count(id) as count from onlineSales WHERE (deletedAt IS NULL AND ((groupId IS NULL OR :userId IN (SELECT autobizUserId FROM users AS u LEFT JOIN groupMembers gm ON (gm.userId = u.id ) WHERE gm.groupId = onlineSales.groupId)))) ${where}`;
    if (order) countQuery += ` ORDER BY ${order}`;
    const count = await this.models.sequelize.query(countQuery, {
      replacements: { userId: userId, country: country },
      type: this.models.sequelize.QueryTypes.SELECT,
    });

    let query = `select * from onlineSales WHERE (deletedAt IS NULL AND ((groupId IS NULL OR :userId IN (SELECT autobizUserId FROM users AS u LEFT JOIN groupMembers gm ON (gm.userId = u.id ) WHERE gm.groupId = onlineSales.groupId)))) ${where}`;
    if (order) query += ` ORDER BY ${order}`;
    if (limit) query += ` LIMIT ${limit} `;
    if (offset) query += ` OFFSET ${offset}`;

    const onlineSales = await this.models.sequelize.query(query, {
      replacements: { userId: userId, country: country },
      type: this.models.sequelize.QueryTypes.SELECT,
    });

    let sales = onlineSales.map((p) => {
      p = this.isBookMarkedByUser(p, userId);
      const sale: Sale = SaleMap.toDomainAll(p);
      sale.calculateUserInfo(userId);
      return sale;
    });

    // order scheduled sales by secondsBeforeStart
    if (searchQuery.sortOrder && searchQuery.sortBy === 'secondsBeforeEnd') {
      sales = this.reorderOnlineSales(sales);
    }

    const pagination = {
      limit: searchQuery.limit,
      offset: searchQuery.offset,
      rows: sales,
      count: count[0].count,
    };

    return pagination;
  }

  public async getBrandModelFilter(userId: string) {
    const brandModelQuery = await this.models.sequelize.query(
      `SELECT v.brandLabel, v.modelLabel,s.supplyType
       FROM sales s
       LEFT JOIN salesStats ss on (s.id = ss.saleId)
       LEFT JOIN vehicles v on (v.id = s.vehicleId)
       WHERE status IN ('LIVE', 'SCHEDULED', 'CLOSED')
       AND (s.groupId IS NULL OR '${userId}' IN (SELECT autobizUserId FROM users AS u LEFT JOIN groupMembers gm ON (gm.userId = u.id ) WHERE gm.groupId = s.groupId))
       AND s.deletedAt IS NULL
       AND v.deletedAt IS NULL`,
      {
        type: this.models.sequelize.QueryTypes.SELECT,
      },
    );

    return brandModelQuery;
  }

  public async getBookmarkedSales(searchQuery?: any) {
    const { userId } = searchQuery || null;

    const bookmarkedSales = await this.models.salebookmark.findAll({
      attributes: ['saleId'],
      where: { userId },
      raw: true,
    });

    const saleId = bookmarkedSales.map((b) => b.saleId);

    searchQuery.filter = {
      ...searchQuery.filter,
      ...{ saleId, status: ['LIVE', 'CLOSED', 'FINISHED', 'ARCHIVED'] },
    };

    return await this.searchSalesPublic(searchQuery, 'SHORT');
  }

  public async getUserOffersSales(searchQuery?: any) {
    const {
      userId,
      filter: { supplyType },
    } = searchQuery || null;

    let listLiveUsersOffers = await this.models.saleoffer.findAll({
      attributes: ['saleId'],
      where: { userId },
      include: [
        {
          attributes: ['id'],
          model: this.models.sale,
          required: true,
          include: [
            {
              attributes: ['status'],
              model: this.models.salesStats,
              required: true,
              where: { status: ['LIVE'] },
            },
          ],
        },
      ],
      group: ['saleId'],
    });

    if (supplyType === 'OFFER_TO_PRIVATE') {
      const listClosedPrivateUserOffers = await this.getUserClosedPrivateSales(
        userId,
      );
      listLiveUsersOffers = listLiveUsersOffers.concat(
        listClosedPrivateUserOffers,
      );
    }

    const saleId = listLiveUsersOffers.map((s) => s.saleId);
    searchQuery.filter = {
      ...searchQuery.filter,
      ...{ saleId, status: ['LIVE', 'CLOSED', 'FINISHED', 'ARCHIVED'] },
    };
    return await this.searchSalesPublic(searchQuery, 'SHORT');
  }

  public async getBookmarkedPointofsalesSales(searchQuery?: any) {
    const { userId } = searchQuery || null;

    const bookmarkedPointofsalesSales =
      await this.models.pointofsalebookmark.findAll({
        attributes: ['pointOfSaleId'],
        where: { userId },
        raw: true,
      });

    const pointOfSaleId = bookmarkedPointofsalesSales.map(
      (b) => b.pointOfSaleId,
    );

    searchQuery.filter = {
      ...searchQuery.filter,
      ...{ pointOfSaleId, status: ['LIVE', 'CLOSED'] },
    };

    return await this.searchSalesPublic(searchQuery, 'SHORT');
  }

  public async getPurchasedSales(searchQuery?: any) {
    const { userId } = searchQuery || null;

    const purchasedSales = await this.models.sale.findAll({
      attributes: ['id'],
      where: { winner: userId },
      raw: true,
    });

    const saleId = purchasedSales.map((b) => b.id);

    searchQuery.filter = {
      ...searchQuery.filter,
      ...{
        saleId,
        status: ['CLOSED', 'FINISHED', 'ARCHIVED'],
      },
    };

    return await this.searchSalesPublic(searchQuery, 'SHORT');
  }

  public async getSaleByUuid(uuid: string, userId: string) {
    const searchQuery = { filter: {}, userId };
    searchQuery.filter = {
      status: [
        'LIVE',
        'CLOSED',
        'SCHEDULED',
        'FINISHED',
        'ARCHIVED',
        'INACTIVE',
      ],
      saleUuid: uuid,
    };

    searchQuery.userId = userId;

    const result = await this.searchSalesPublic(searchQuery, 'FULL');

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    throw new Error('Sale not found.');
  }

  public async getSaleInfo(uuid: string, userId: string): Promise<Sale> {
    const result = await this.models.sale.findOne({
      include: [
        { model: this.models.salesStats },
        { model: this.models.saleoffer },
        { model: this.models.user },
      ],
      where: {
        uuid,
      },
    });
    if (!!result === false) throw new Error('sale not found.');
    const sale = SaleMap.toDomain(result);
    sale.calculateUserInfo(userId);
    return sale;
  }

  async exists(id: number): Promise<boolean> {
    const sale = await this.models.sale.findOne({
      where: {
        id,
      },
    });
    return !!sale === true;
  }

  async save(sale: Sale): Promise<number> {
    const rawSale = await SaleMap.toPersistence(sale);

    let exists: boolean = false;
    if (sale?.id) {
      exists = await this.exists(sale.id);
    }

    let sequelizeModel;

    try {
      if (!exists) {
        sequelizeModel = await this.models.sale.create(rawSale);
      } else {
        await this.models.sale.update(rawSale, {
          where: {
            id: sale.id,
          },
          individualHooks: true,
        });

        // IF ASSIGNED WINNER/WINNER FORCED NOT CALL SALES PROC
        if (!('winner' in sale)) {
          await this.models.sequelize.query(`CALL calcSales(${sale.id})`);
        }

        sequelizeModel = await this.models.sale.findOne({
          where: { id: sale.id },
        });
      }
    } catch (error) {
      console.warn(error);
      throw new Error('Sale sequelize error.');
    }

    return sequelizeModel.id;
  }

  public async delete(id: number, user: string) {
    const sale = await this.models.sale.findOne({ where: { id } });
    const found = !!sale === true;

    if (!found) throw new Error('sale not found');

    await this.models.sale.update(
      { deletedBy: user },
      {
        where: {
          id,
        },
      },
    );

    return this.models.sale.destroy({ where: { id }, individualHooks: true });
  }

  public async hasValidatedSiblingsSales(vehicleId: number, saleId?: number) {
    let countValidatedSales = 0;
    if (saleId) {
      countValidatedSales = await this.models.sale.count({
        include: [
          {
            model: this.models.salesStats,
            where: {
              status: { [Op.in]: ['LIVE', 'SCHEDULED'] },
            },
          },
        ],
        where: {
          vehicleId,
          validationStatus: 'VALIDATED',
          id: {
            [Op.ne]: saleId,
          },
        },
      });
    } else {
      countValidatedSales = await this.models.sale.count({
        include: [
          {
            model: this.models.salesStats,
            where: {
              status: { [Op.in]: ['LIVE', 'SCHEDULED'] },
            },
          },
        ],
        where: {
          vehicleId,
          validationStatus: 'VALIDATED',
        },
      });
    }

    if (countValidatedSales > 0) {
      return true;
    }

    return false;
  }

  public async getOnlineInStockSales() {
    const sales = await this.models.sale.findAll({
      include: [
        { model: this.models.salesStats, where: { status: 'LIVE' } },
        {
          attributes: [
            'fileNumber',
            'brandLabel',
            'modelLabel',
            'versionLabel',
            'mileage',
            'carPictures',
          ],
          model: this.models.vehicle,
          include: [
            { attributes: ['name', 'country'], model: this.models.pointofsale },
          ],
        },
      ],
      where: {
        supplyType: 'STOCK',
      },
    });
    return sales.map((s) => SaleMap.toDomain(s));
  }

  public async getSalesJustEnded(
    interval: [string, string],
  ): Promise<number[]> {
    const sales = await this.models.sale.findAll({
      attributes: ['id'],
      where: {
        validationStatus: 'VALIDATED',
        winner: {
          [Op.ne]: null,
        },
        assignedWinner: {
          [Op.is]: null,
        },
        endDateTime: {
          [Op.between]: interval,
        },
      },
    });
    return sales.map((s) => s.id);
  }

  public reorderOnlineSales(onlineSales: Array<Sale>) {
    const firstScheduledSale = _.findIndex(
      onlineSales,
      (s) => s.status === 'SCHEDULED',
    );
    let scheduledSales = _.filter(onlineSales, (s) => s.status === 'SCHEDULED');
    scheduledSales = _.orderBy(scheduledSales, ['secondsBeforeStart'], ['asc']);
    let index = firstScheduledSale;
    _.map(scheduledSales, (sale, pos) => {
      if (pos !== 0) {
        index = index + 1;
      }
      onlineSales.splice(index, 1, sale);
    });
    return onlineSales;
  }

  public async getUserClosedPrivateSales(userId: string) {
    const result = await this.models.saleoffer.findAll({
      attributes: ['saleId'],
      where: { userId },
      include: [
        {
          attributes: ['id'],
          model: this.models.sale,
          required: true,
          where: {
            supplyType: 'OFFER_TO_PRIVATE',
          },
          include: [
            {
              attributes: ['status'],
              model: this.models.salesStats,
              required: true,
              where: { status: ['CLOSED', 'FINISHED', 'ARCHIVED'] },
            },
            {
              attributes: ['id', 'entryStockDate'],
              model: this.models.vehicle,
              required: true,
              where: {
                [Op.and]: literal(
                  '(SELECT DATE_ADD(entryStockDate, INTERVAL 15 DAY)) >= DATE(NOW())',
                ),
              },
            },
          ],
        },
      ],
      group: ['saleId'],
    });
    return result;
  }
  public isBookMarkedByUser(sale: any, userId: string) {
    let userBookmarks = [];
    if (userId && sale.salebookmarks) {
      const salebookmarks = '[' + sale.salebookmarks + ']';
      userBookmarks = _.filter(JSON.parse(salebookmarks), { userId });
    }
    return { ...sale, salebookmarks: userBookmarks };
  }
}
