import { IPartnerRequestRepo } from '../partnerRequestRepo';
import { PartnerRequestMap } from '../../mappers/PartnerRequestMap';
import { SearchQuery } from '../../../../infra/http/HttpRequest';
import { Op } from 'sequelize';

import {
  CreatePartnerRequestPropsDto,
  UpdatePartnerRequestPropsDto,
} from '../../useCases/createPartnerRequest/CreatePartnerRequestDtos';
import { PartnerRequest } from '../../domain/partnerRequest';
import { formatRegistration } from '../../../../shared/helpers/VehicleHelper';
export class SequelizePartnerRequestRepo implements IPartnerRequestRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  public async getPartnerRequests(searchQuery: SearchQuery) {
    const { limit, offset, sortBy, sortOrder, filter } = searchQuery;

    let where;
    const whereVehicle = {};

    const {
      id,
      uuid,
      statusId,
      vehicleId,
      partnerId,
      comment,
      saleComment,
      fileNumber,
      registrationLike,
      createdBy,
      pointOfSaleId,
    } = filter;
    id ? (where = { ...{ id }, ...where }) : null;
    uuid ? (where = { ...{ uuid }, ...where }) : null;
    statusId ? (where = { ...{ statusId }, ...where }) : null;
    vehicleId ? (where = { ...{ vehicleId }, ...where }) : null;
    partnerId ? (where = { ...{ partnerId }, ...where }) : null;
    comment ? (where = { ...{ comment }, ...where }) : null;
    saleComment ? (where = { ...{ saleComment }, ...where }) : null;
    createdBy ? (where = { ...{ createdBy }, ...where }) : null;

    if (fileNumber) {
      whereVehicle['fileNumber'] = {
        [Op.substring]: fileNumber,
      };
    }

    if (registrationLike) {
      whereVehicle['registration'] = {
        [Op.substring]: registrationLike,
        [Op.or]: [
          { [Op.substring]: registrationLike },
          {
            [Op.substring]: formatRegistration('XX-XXX-XX', registrationLike),
          },
        ],
      };
    }

    if (pointOfSaleId) {
      whereVehicle['pointOfSaleId'] = pointOfSaleId;
    }

    try {
      const query = await this.models.partnerrequest.findAndCountAll({
        where,
        include: [
          { model: this.models.partnerrequeststatus },
          { model: this.models.partner },
          { model: this.models.partnerlastoffer },
          {
            model: this.models.vehicle,
            where: whereVehicle,
            attributes: [
              'fileNumber',
              'registration',
              'brandLabel',
              'modelLabel',
            ],
            include: [
              {
                attributes: ['name'],
                model: this.models.pointofsale,
              },
            ],
          },
        ],
        limit,
        offset,
        order: [[sortBy, sortOrder]],
      });

      const pagination = {
        limit,
        offset,
        rows: query.rows.map((p) => PartnerRequestMap.toDomain(p)),
        count: query.count,
      };

      return pagination;
    } catch (error) {
      console.warn(error);
      throw new Error('Search Partner Request failed.');
    }
  }

  public async getPartnerRequestByUuid(
    partnerRequestUuid: string,
  ): Promise<PartnerRequest> {
    const partnerReq = await this.models.partnerrequest.findOne({
      where: {
        uuid: partnerRequestUuid,
      },
    });
    if (!!partnerReq === false) throw new Error('Partner Request not found.');
    return PartnerRequestMap.toDomain(partnerReq);
  }

  public async savePartnerRequests({
    vehicleId,
    partnerId,
    saleComment,
    uuid,
    createdBy,
  }: CreatePartnerRequestPropsDto) {
    const statusId = 5;
    const partnerRequest = await this.models.partnerrequest.create({
      partnerId,
      vehicleId,
      statusId,
      uuid,
      saleComment,
      createdBy,
    });
    const requestId = partnerRequest.id;

    if (!requestId) {
      throw Error('fail create request');
    }

    return partnerRequest.id;
  }

  public async updatePartnerRequests({
    uuid,
    statusId,
    comment,
  }: UpdatePartnerRequestPropsDto) {
    if (typeof comment !== 'string') comment = '';

    await this.models.partnerrequest.update(
      { comment, statusId },
      {
        where: {
          uuid,
        },
      },
    );
    return uuid;
  }
}
