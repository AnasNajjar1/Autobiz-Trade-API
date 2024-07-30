import { ListPicture } from './listPicture';

describe('ListPicture types', () => {
  it('should undefined be tolerated', async () => {
    const result = ListPicture.create(undefined);
    expect(result.isSuccess).toBe(true);
  });

  it('should accept a uri', async () => {
    const result = ListPicture.create('http://lorempixel.com/400/200/');
    expect(result.isSuccess).toBe(true);
  });

  it('should not accept non uri string', async () => {
    const result = ListPicture.create('image.jpg');
    expect(result.isFailure).toBe(true);
  });
});
