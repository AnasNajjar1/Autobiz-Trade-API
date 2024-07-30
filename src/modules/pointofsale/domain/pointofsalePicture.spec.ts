import { PointofsalePicture } from './pointofsalePicture';

describe('PointofsalePicture types', () => {
  it('should undefined be tolerated', async () => {
    const result = PointofsalePicture.create(undefined);
    expect(result.isSuccess).toBe(true);
  });

  it('should accept a uri', async () => {
    const result = PointofsalePicture.create('http://lorempixel.com/400/200/');
    expect(result.isSuccess).toBe(true);
  });

  it('should not accept non uri string', async () => {
    const result = PointofsalePicture.create('image.jpg');
    expect(result.isFailure).toBe(true);
  });
});
