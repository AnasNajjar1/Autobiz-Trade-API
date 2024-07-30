import { IPartnerOfferRepo } from '../partnerOfferRepo';
import { PartnerOfferMap } from '../../mappers/PartnerOfferMap';
import { SearchQuery } from '../../../../infra/http/HttpRequest';
import { PartnerOffer } from '../../domain/partnerOffer';

export class SequelizePartnerOfferRepo implements IPartnerOfferRepo {
  private models: any;

  constructor(models: any) {
    this.models = models;
  }

  public async getPartnerOffers(searchQuery: SearchQuery) {
    const { limit, offset, sortBy, sortOrder, filter } = searchQuery;

    let where;

    const { id, value, partnerRequestId } = filter;
    id ? (where = { ...{ id }, ...where }) : null;
    value ? (where = { ...{ value }, ...where }) : null;
    partnerRequestId ? (where = { ...{ partnerRequestId }, ...where }) : null;

    try {
      const query = await this.models.partneroffer.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
      });

      const pagination = {
        limit,
        offset,
        rows: query.rows.map((p) => PartnerOfferMap.toDomain(p)),
        count: query.count,
      };

      return pagination;
    } catch (error) {
      throw new Error('Search Partner Offer failed.');
    }
  }
}
