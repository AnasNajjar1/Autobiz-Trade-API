import { SearchQuery } from '../../../infra/http/HttpRequest';
import { PartnerRequest } from '../domain/partnerRequest';
import {
  CreatePartnerRequestPropsDto,
  UpdatePartnerRequestPropsDto,
} from '../useCases/createPartnerRequest/CreatePartnerRequestDtos';

export interface IPartnerRequestRepo {
  getPartnerRequests(searchQuery: SearchQuery): Promise<any>;
  savePartnerRequests(props: CreatePartnerRequestPropsDto): Promise<any>;
  updatePartnerRequests(props: UpdatePartnerRequestPropsDto): Promise<any>;
  getPartnerRequestByUuid(uuid: string): Promise<PartnerRequest>;
}
