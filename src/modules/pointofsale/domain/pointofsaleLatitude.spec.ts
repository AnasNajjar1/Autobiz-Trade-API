import { PointofsaleLatitude } from './pointofsaleLatitude';

describe('PointofsaleLatitude types', () => {
  it('should undefined be tolerated', async () => {
    const result = PointofsaleLatitude.create(undefined);
    expect(result.isSuccess).toBe(true);
  });

  it('should not be less than -90', async () => {
    const result = PointofsaleLatitude.create(-91);
    expect(result.isFailure).toBe(true);
  });

  it('should not be greater than 90', async () => {
    const result = PointofsaleLatitude.create(91);
    expect(result.isFailure).toBe(true);
  });

  it('should be between -90 and +90', async () => {
    const result = PointofsaleLatitude.create(48.8534);
    expect(result.isSuccess).toBe(true);
  });
});
