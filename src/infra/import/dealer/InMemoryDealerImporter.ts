import { IDealerImporterService } from './DealerImporterService';

export class InMemoryDealerImporter implements IDealerImporterService {
  public getDealer(code: string, country?: string) {
    return Promise.resolve({
      id: '11111',
      name: 'in Memory Point of sale',
      zipCode: '75001',
      city: 'Paris',
      latitude: 48.860439,
      longitude: 2.34167,
      country: country ? country : 'fr',
    });
  }
}
