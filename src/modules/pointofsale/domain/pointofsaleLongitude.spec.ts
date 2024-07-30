import { PointofsaleLongitude } from './pointofsaleLongitude';

describe('PointofsaleLongitude types', () => {
  it('should undefined be tolerated', async () => {
    const result = PointofsaleLongitude.create(undefined);
    expect(result.isSuccess).toBe(true);
  });

  it('should not be less than -180', async () => {
    const result = PointofsaleLongitude.create(-181);
    expect(result.isFailure).toBe(true);
  });

  it('should not be greater than 180', async () => {
    const result = PointofsaleLongitude.create(181);
    expect(result.isFailure).toBe(true);
  });

  it('should be between -180 and +180', async () => {
    const result = PointofsaleLongitude.create(2.3488);
    expect(result.isSuccess).toBe(true);
  });
});
