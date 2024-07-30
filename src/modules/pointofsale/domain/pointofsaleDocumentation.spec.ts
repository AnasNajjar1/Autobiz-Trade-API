import { PointofsaleDocumentation } from './pointofsaleDocumentation';

describe('PointofsaleDocumentation types', () => {
  it('should not be set', async () => {
    const result = PointofsaleDocumentation.create('');
    expect(result.isSuccess).toBe(true);
  });

  it('should undefined be tolerated', async () => {
    const result = PointofsaleDocumentation.create(undefined);
    expect(result.isSuccess).toBe(true);
  });

  it('should accept array of documentation with title and pdf', async () => {
    const result = PointofsaleDocumentation.create([
      { title: 'Lorem', pdf: 'http://lorempixel.com/400/200/' },
      {
        title: 'Impsum',
        pdf: 'http://lorempixel.com/400/200/',
        text: 'Lorem ipsum',
      },
    ]);
    expect(result.isSuccess).toBe(true);
  });

  it('should not accept empty pdf', async () => {
    const result = PointofsaleDocumentation.create([{ title: 'Lorem' }]);
    expect(result.isFailure).toBe(true);
  });

  it('should not accept non uri pdf', async () => {
    const result = PointofsaleDocumentation.create([
      { title: 'title', pdf: 'xxx' },
    ]);
    expect(result.isFailure).toBe(true);
  });

  it('should not accept empty title', async () => {
    const result = PointofsaleDocumentation.create([{ pdf: 'xxx' }]);
    expect(result.isFailure).toBe(true);
  });
});
