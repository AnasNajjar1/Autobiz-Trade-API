import { IPartnerRepo } from '../partnerRepo';
import { PartnerMap } from '../../mappers/PartnerMap';
import { SearchQuery } from '../../../../infra/http/HttpRequest';
import { Partner } from '../../domain/partner';

export class SequelizePartnerRepo implements IPartnerRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  public async getPartnerById(partnerId: number): Promise<Partner> {
    const partner = await this.models.partner.findOne({
      where: {
        id: partnerId,
      },
    });
    if (!!partner === false) throw new Error('Partner not found.');
    return PartnerMap.toDomain(partner);
  }

  public async getPartners(searchQuery: SearchQuery) {
    const { limit, offset, sortBy, sortOrder, filter } = searchQuery;

    let where;

    const { id, name } = filter;
    id ? (where = { ...{ id }, ...where }) : null;
    name ? (where = { ...{ name }, ...where }) : null;

    try {
      const query = await this.models.partner.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
      });

      const pagination = {
        limit,
        offset,
        rows: query.rows.map((p) => PartnerMap.toDomain(p)),
        count: query.count,
      };

      return pagination;
    } catch (error) {
      throw new Error('Search Partner failed.');
    }
  }
}
