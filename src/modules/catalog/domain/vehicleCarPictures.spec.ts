import { VehicleCarPictures } from './vehicleCarPictures';

describe('VehicleCarPictures types', () => {
  it('shoube be not required', async () => {
    const result = VehicleCarPictures.create(null);
    expect(result.isSuccess).toBe(true);
  });

  it('should accept object with key and value as uri', async () => {
    const result = VehicleCarPictures.create({
      profile1: 'https://www.google.com',
      profile2: 'https://www.google.de',
    });
    expect(result.isSuccess).toBe(true);
  });

  it('should not accept object with a non-uri value', async () => {
    const result = VehicleCarPictures.create({
      profile: 'XXX',
    });
    expect(result.isFailure).toBe(true);
  });

  it('should accept stringified json object and parse it', async () => {
    const result = VehicleCarPictures.create(
      '{"profile":"https://www.google.fr"}',
    );
    expect(result.getValue().value.profile).toBe('https://www.google.fr');
    expect(result.isSuccess).toBe(true);
  });
});
