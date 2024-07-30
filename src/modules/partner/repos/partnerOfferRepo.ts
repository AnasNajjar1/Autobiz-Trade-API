import { SearchQuery } from '../../../infra/http/HttpRequest';
import { PartnerOffer } from '../domain/partnerOffer';

export interface IPartnerOfferRepo {
  getPartnerOffers(searchQuery: SearchQuery): Promise<any>;
}
