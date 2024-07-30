import { IOfferRepo } from '../offerRepo';
import { Op, fn, literal, col } from 'sequelize';
import { Offer } from '../../domain/offer';
import { OfferMap } from '../../mappers/OfferMap';
import { formatRegistration } from '../../../../shared/helpers/VehicleHelper';
export class SequelizeOfferRepo implements IOfferRepo {
  private models: any;

  public constructor(models: any) {
    this.models = models;
  }

  async save(offer: Offer): Promise<void> {
    const rawOffer = await OfferMap.toPersistence(offer);

    try {
      const result = await this.models.saleoffer.create(rawOffer);
    } catch (error) {
      console.warn(error);
      throw new Error('Offer sequelize error.');
    }
  }

  public async delete(id: number) {
    const offer = await this.models.saleoffer.findOne({ where: { id } });
    const found = !!offer === true;
    if (!found) throw new Error('offer not found');
    return offer.destroy({ where: { id } });
  }

  public async getAdminOffers(searchQuery: any): Promise<any> {
    const { filter } = searchQuery || {};

    const whereVehicle = {};
    const whereOffer = {};
    const whereSale = {};
    const wherePointofsale = {};

    const {
      fileNumber,
      fileNumberLike,
      saleId,
      vehicleId,
      supplyType,
      startDateTimeMin,
      endDateTimeMax,
      offerType,
      country,
      createdAtInterval,
      userId,
      registration,
      registrationLike,
    } = filter || {};

    if (fileNumber) {
      whereVehicle['fileNumber'] = fileNumber;
    }

    if (vehicleId) {
      whereVehicle['id'] = vehicleId;
    }

    if (fileNumberLike) {
      whereVehicle['fileNumber'] = {
        [Op.substring]: fileNumberLike,
      };
    }

    if (offerType) {
      whereOffer['offerType'] = offerType;
    }

    if (saleId) {
      whereOffer['saleId'] = saleId;
    }

    if (userId) {
      whereOffer['userId'] = userId;
    }

    if (supplyType) {
      whereSale['supplyType'] = supplyType;
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

    if (createdAtInterval) {
      whereSale['createdAt'] = {
        [Op.between]: createdAtInterval,
      };
    }

    if (registration) {
      whereVehicle['registration'] = registration;
    }

    if (registrationLike) {
      whereVehicle['registration'] = {
        [Op.or]: [
          { [Op.substring]: registrationLike },
          {
            [Op.substring]: formatRegistration('XX-XXX-XX', registrationLike),
          },
        ],
      };
    }
    const result = await this.models.saleoffer.findAndCountAll({
      attributes: [
        'id',
        'amount',
        'offerType',
        'userId',
        'saleId',
        'createdAt',
      ],
      include: [
        {
          attributes: [
            'auctionStartPrice',
            'auctionReservePrice',
            'immediatePurchasePrice',
            'winner',
            'assignedWinner',
            'assignedWinnerOffer',
            'bestOfferType',
            'bestOfferer',
            'bestAuction',
            'acceptImmediatePurchase',
            'acceptAuction',
          ],
          model: this.models.sale,
          required: true,
          where: whereSale,
          include: [
            {
              attributes: [
                'fileNumber',
                'brandLabel',
                'modelLabel',
                'b2cMarketValue',
                'entryStockDate',
                'registration',
              ],
              model: this.models.vehicle,
              where: whereVehicle,
              required: true,
              include: [
                {
                  attributes: ['name'],
                  model: this.models.pointofsale,
                  where: wherePointofsale,
                },
              ],
            },
            {
              attributes: ['status'],
              model: this.models.salesStats,
            },
          ],
        },
      ],
      where: whereOffer,
      limit: searchQuery.limit,
      offset: searchQuery.offset,
      order: [
        [
          literal(
            searchQuery.sortBy.split('.').slice(-1) +
              ' ' +
              searchQuery.sortOrder,
          ),
        ],
      ],
    });

    const pagination = {
      limit: searchQuery.limit,
      offset: searchQuery.offset,
      rows: result.rows.map((p) => OfferMap.toAdminFullDto(p)),
      count: result.count,
    };
    return pagination;
  }

  public async getOffers(searchQuery: any): Promise<any> {
    const { limit, offset, filter } = searchQuery || {};
    let { sortBy, sortOrder } = searchQuery;
    sortBy = sortBy ? sortBy : 'id';
    sortOrder = sortOrder ? sortOrder : 'desc';

    const whereOffer = {};

    const { userId, createdAtInterval } = filter || {};

    if (userId) {
      whereOffer['userId'] = userId;
    }

    if (createdAtInterval) {
      whereOffer['createdAt'] = {
        [Op.between]: createdAtInterval,
      };
    }

    const query = {
      attributes: [
        'id',
        'amount',
        'offerType',
        'userId',
        'saleId',
        'createdAt',
      ],
      include: [
        {
          attributes: [
            'supplyType',
            'auctionStartPrice',
            'auctionReservePrice',
            'immediatePurchasePrice',
            'winner',
            'assignedWinner',
            'assignedWinnerOffer',
            'bestOfferType',
            'bestOfferer',
            'bestAuction',
          ],
          model: this.models.sale,
          required: true,
          include: [
            {
              attributes: [
                'mileage',
                'fileNumber',
                'brandLabel',
                'modelLabel',
                'versionLabel',
                'entryStockDate',
              ],
              model: this.models.vehicle,
              required: true,
              include: [
                {
                  attributes: ['name'],
                  model: this.models.pointofsale,
                },
              ],
            },
          ],
        },
      ],
      where: whereOffer,
      order: [[literal(sortBy + ' ' + sortOrder)]],
    };

    if (limit) query['limit'] = limit;
    if (offset) query['offset'] = offset;

    const result = await this.models.saleoffer.findAndCountAll(query);

    const pagination = {
      limit: searchQuery.limit,
      offset: searchQuery.offset,
      rows: result.rows.map((row) => OfferMap.toPublicFullDto(row)),
      count: result.count,
    };
    return pagination;
  }
}
