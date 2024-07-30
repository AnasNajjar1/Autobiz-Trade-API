import { VehicleFileNumber } from './vehicleFileNumber';

describe('VehicleFileNumber types', () => {
  it('shoube be not required', async () => {
    const result = VehicleFileNumber.create(null);
    expect(result.isFailure).toBe(false);
  });

  it('should be invalid when value is less than 2 characters', async () => {
    const result = VehicleFileNumber.create('x');
    expect(result.isFailure).toBe(true);
  });

  it('should be invalid when value is more than 50 characters', async () => {
    const result = VehicleFileNumber.create(
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxc',
    );
    expect(result.isFailure).toBe(true);
  });

  it('should be valid when value is between 2 and 50 characters', async () => {
    const result = VehicleFileNumber.create('xxx');
    expect(result.isSuccess).toBe(true);
  });
});
