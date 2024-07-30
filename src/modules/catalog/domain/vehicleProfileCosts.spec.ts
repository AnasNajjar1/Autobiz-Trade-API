import { VehicleProfileCosts } from './vehicleProfileCosts';

describe('VehicleFileNumber types', () => {
  it('shoube accept null value', async () => {
    const result = VehicleProfileCosts.create(null);
    expect(result.isSuccess).toBe(true);
  });

  it('should be valid when value is A,B,C,D OR E', async () => {
    expect(VehicleProfileCosts.create('A').isSuccess).toBe(true);
    expect(VehicleProfileCosts.create('B').isSuccess).toBe(true);
    expect(VehicleProfileCosts.create('C').isSuccess).toBe(true);
    expect(VehicleProfileCosts.create('D').isSuccess).toBe(true);
    expect(VehicleProfileCosts.create('E').isSuccess).toBe(true);
  });

  it('should be trimed and lowercased', async () => {
    const result = VehicleProfileCosts.create(' a ');
    expect(result.isSuccess).toBe(true);
    expect(result.getValue().value).toBe('A');
  });

  it('should not accept value is not A,B,C,D OR E', async () => {
    const result = VehicleProfileCosts.create('Z');
    expect(result.isFailure).toBe(true);
  });
});
