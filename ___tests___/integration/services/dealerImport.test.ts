require('dotenv').config({ path: '.env.' + process.env.NODE_ENV });
import { InMemoryDealerImporter } from '../../../src/infra/import/dealer/InMemoryDealerImporter';
import { AutobizDealerImporter } from '../../../src/infra/import/dealer/AutobizDealerImporter';
import { DealerImporterService } from '../../../src/infra/import/dealer/DealerImporterService';

describe('import dealer', () => {
  it('should import an in memory dealer', async () => {
    const inMemoryImporter = new InMemoryDealerImporter();

    const dealer = await new DealerImporterService(inMemoryImporter).getDealer(
      'code',
    );

    expect(dealer).toMatchObject({
      id: '11111',
      name: 'in Memory Point of sale',
      zipCode: '75001',
      city: 'Paris',
      latitude: 48.860439,
      longitude: 2.34167,
      country: 'fr',
    });
  });

  // TODO: move this to integration test
  it('should import an autobiz dealer with the id 137215 (fr) from stg', async () => {
    const autobizImporter = new AutobizDealerImporter();

    const dealer = await new DealerImporterService(autobizImporter).getDealer(
      '137215',
      'fr',
    );

    expect(dealer.id).toBe(137215);
    expect(typeof dealer.name).toBe('string');
    expect(typeof dealer.zipCode).toBe('string');
  });

  it('should import an autobiz dealer with the id ES_197863 from stg', async () => {
    const autobizImporter = new AutobizDealerImporter();

    const dealer = await new DealerImporterService(autobizImporter).getDealer(
      'ES_197863',
    );

    expect(dealer.id).toBe(197863);
    expect(dealer.country).toBe('es');
    expect(typeof dealer.name).toBe('string');
    expect(typeof dealer.zipCode).toBe('string');
  });
});
