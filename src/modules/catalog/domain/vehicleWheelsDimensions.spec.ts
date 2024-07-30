import { VehicleWheelsDimension } from './vehicleWheelsDimensions';

describe('VehicleWheelsDimension types', () => {
  it('shoube be not be a empty string', async () => {
    const result = VehicleWheelsDimension.create('');
    expect(result.isFailure).toBe(true);
  });

  it('should undefined be accepted', async () => {
    const result = VehicleWheelsDimension.create(undefined);
    expect(result.isSuccess).toBe(true);
  });

  it('should accept an object with keys : diameter, width, height', async () => {
    const result = VehicleWheelsDimension.create({
      diameter: '18',
      width: '235',
      height: '45',
    });
    expect(result.isSuccess).toBe(true);
  });

  it('should not accept document without one parameter', async () => {
    const result = VehicleWheelsDimension.create([{ diameter: 'asd' }]);
    expect(result.isFailure).toBe(true);
  });

  it('should accept stringified json object and parse it', async () => {
    const result = VehicleWheelsDimension.create(
      '{"diameter":"16","width":"205","height":"55"}',
    );
    expect(result.getValue().value.diameter).toBe('16');
    expect(result.getValue().value.width).toBe('205');
    expect(result.getValue().value.height).toBe('55');
    expect(result.isSuccess).toBe(true);
  });
});
