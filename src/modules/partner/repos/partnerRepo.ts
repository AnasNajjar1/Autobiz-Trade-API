import { SearchQuery } from '../../../infra/http/HttpRequest';
import { Partner } from '../domain/partner';

export interface IPartnerRepo {
  getPartners(searchQuery: SearchQuery): Promise<any>;
  getPartnerById(parntnerId: number): Promise<Partner>;
}
