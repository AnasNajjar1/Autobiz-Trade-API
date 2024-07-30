import { PointofsaleCountry } from './pointofsaleCountry';

describe('PointofsaleCountry types', () => {
  it('should not be set', async () => {
    const result = PointofsaleCountry.create('');
    expect(result.isSuccess).toBe(true);
  });

  it('should undefined be tolerated', async () => {
    const result = PointofsaleCountry.create(undefined);
    expect(result.isSuccess).toBe(true);
  });

  it('should be trimed and lowercased', async () => {
    const result = PointofsaleCountry.create(' Fr ');
    expect(result.isSuccess).toBe(true);
    expect(result.getValue().value).toBe('fr');
  });

  it('should be a autobiz known country', async () => {
    const result = PointofsaleCountry.create('FR');
    expect(result.isSuccess).toBe(true);
  });

  it('should not be a autobiz unknown country', async () => {
    const result = PointofsaleCountry.create('JP');
    expect(result.isFailure).toBe(true);
  });
});
