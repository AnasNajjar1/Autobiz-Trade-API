import { VehicleDeclaredEquipments } from './vehicleDeclaredEquipments';

describe('VehicleDeclaredEquipments types', () => {
  it('shoube be not required', async () => {
    const result = VehicleDeclaredEquipments.create(null);
    expect(result.isSuccess).toBe(true);
  });

  it('should be an array of string', async () => {
    const result = VehicleDeclaredEquipments.create([
      'peintureMetalliseeOuNacree',
      'retroviseursElectriques',
    ]);
    expect(result.isSuccess).toBe(true);
  });

  it('should accept stringified json object and parse it', async () => {
    const result = VehicleDeclaredEquipments.create(
      '["navigateurGps","climatisationGenerale"]',
    );

    expect(result.getValue().value[0]).toBe('navigateurGps');
    expect(result.getValue().value[1]).toBe('climatisationGenerale');
    expect(result.isSuccess).toBe(true);
  });
});
