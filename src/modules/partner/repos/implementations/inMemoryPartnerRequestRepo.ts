import { IPartnerRequestRepo } from '../partnerRequestRepo';
import {
  CreatePartnerRequestPropsDto,
  UpdatePartnerRequestPropsDto,
} from '../../useCases/createPartnerRequest/CreatePartnerRequestDtos';
import { SearchQuery } from '../../../../infra/http/HttpRequest';

export class InMemoryPartnerRequestRepo implements IPartnerRequestRepo {
  private mocked;

  public constructor(mocked) {
    this.mocked = mocked;
  }
  public async getPartnerRequests(searchQuery: SearchQuery): Promise<any> {
    return Promise.resolve();
  }
  public async updatePartnerRequests({
    uuid,
    statusId,
    comment,
  }: UpdatePartnerRequestPropsDto): Promise<any> {
    this.mocked[0] = { uuid, statusId, comment };
    return Promise.resolve(this.mocked[0].uuid);
  }

  public async savePartnerRequests({
    vehicleId,
    partnerId,
    saleComment,
    uuid,
    createdBy,
  }: CreatePartnerRequestPropsDto): Promise<any> {
    this.mocked.push({
      id: 1,
      vehicleId,
      partnerId,
      saleComment,
      uuid,
      createdBy,
    });
    return Promise.resolve(this.mocked[0].id);
  }

  public async getPartnerRequestByUuid(
    partnerRequestUuid: string,
  ): Promise<any> {
    const partnerRequest = this.mocked.find(
      (elem) => elem.uuid === partnerRequestUuid,
    );

    return Promise.resolve(partnerRequest ? partnerRequest : null);
  }
}
