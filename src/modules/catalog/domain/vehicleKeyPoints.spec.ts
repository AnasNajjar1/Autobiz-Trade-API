import { VehicleKeyPoints } from './vehicleKeyPoints';

describe('VehicleKeyPoints types', () => {
  it('shoube be not required', async () => {
    const result = VehicleKeyPoints.create(null);
    expect(result.isSuccess).toBe(true);
  });

  it('should be an array of string', async () => {
    const result = VehicleKeyPoints.create(['fewCotsts', 'smallPrice']);
    expect(result.isSuccess).toBe(true);
  });

  it('should not accept array with non string value', async () => {
    const result = VehicleKeyPoints.create([
      'fewCotsts',
      { key: 1, value: 'A' },
    ]);
    expect(result.isFailure).toBe(true);
  });

  it('should accept stringified json object and parse it', async () => {
    const result = VehicleKeyPoints.create('["highDemand","essence"]');

    expect(result.getValue().value[0]).toBe('highDemand');
    expect(result.getValue().value[1]).toBe('essence');
    expect(result.isSuccess).toBe(true);
  });
});
