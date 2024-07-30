import { IPartnerRepo } from '../partnerRepo';
import { PartnerMap } from '../../mappers/PartnerMap';
import { Partner } from '../../domain/partner';
import { SearchQuery } from '../../../../infra/http/HttpRequest';

export class InMemoryPartnerRepo implements IPartnerRepo {
  private mocked;

  public constructor(mock: Partner[]) {
    this.mocked = mock;
  }

  public getPartnerById(id: number): Promise<Partner> {
    const partner = this.mocked.find((x) => x.id === id);
    if (!!partner === false) throw new Error('partner not found.');
    return Promise.resolve(PartnerMap.toDomain(partner));
  }

  public getPartners(searchQuery: SearchQuery) {
    const partners = this.mocked;

    const result = {
      limit: 10,
      offset: 0,
      rows: partners.map((p) => PartnerMap.toDomain(p)),
      count: this.mocked.length,
    };

    return Promise.resolve(result);
  }
}
