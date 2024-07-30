import { VehicleDocuments } from './vehicleDocuments';

describe('VehicleDocuments types', () => {
  it('shoube be not required', async () => {
    const result = VehicleDocuments.create('');
    expect(result.isSuccess).toBe(true);
  });

  it('should undefined be tolerated', async () => {
    const result = VehicleDocuments.create(undefined);
    expect(result.isSuccess).toBe(true);
  });

  it('should accept array of document with title and link', async () => {
    const result = VehicleDocuments.create([
      { title: 'Lorem', link: 'http://www.google.com' },
      {
        title: 'Impsum',
        link: 'http://www.google.fr',
      },
    ]);
    expect(result.isSuccess).toBe(true);
  });

  it('should not accept document without link', async () => {
    const result = VehicleDocuments.create([{ title: 'Lorem' }]);
    expect(result.isFailure).toBe(true);
  });

  it('should not accept non uri link', async () => {
    const result = VehicleDocuments.create([{ title: 'title', link: 'xxx' }]);
    expect(result.isFailure).toBe(true);
  });

  it('should accept stringified json object and parse it', async () => {
    const result = VehicleDocuments.create(
      '[{"link":"https://google.de","title":"google-de"}]',
    );
    expect(result.getValue().value[0].link).toBe('https://google.de');
    expect(result.getValue().value[0].title).toBe('google-de');
    expect(result.isSuccess).toBe(true);
  });
});
