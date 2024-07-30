import { VehicleConstructorEquipments } from './vehicleConstructorEquipments';

describe('VehicleConstructorEquipments types', () => {
  it('shoube be not required', async () => {
    const result = VehicleConstructorEquipments.create(null);
    expect(result.isSuccess).toBe(true);
  });

  it('should be an array of string', async () => {
    const result = VehicleConstructorEquipments.create([
      'directionAssistee',
      'abs',
    ]);
    expect(result.isSuccess).toBe(true);
  });

  it('should not accept array with non string value', async () => {
    const result = VehicleConstructorEquipments.create(['fewCotsts', 1]);
    expect(result.isFailure).toBe(true);
  });

  it('should accept stringified json object and parse it', async () => {
    const result = VehicleConstructorEquipments.create(
      '["kitAntiCrevaison","roueDeSecours"]',
    );

    expect(result.getValue().value[0]).toBe('kitAntiCrevaison');
    expect(result.getValue().value[1]).toBe('roueDeSecours');
    expect(result.isSuccess).toBe(true);
  });
});
