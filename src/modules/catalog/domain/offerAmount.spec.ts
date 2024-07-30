import { OfferAmount } from './offerAmount';

describe('OfferAmount types', () => {
  it('Should be required', async () => {
    expect(OfferAmount.create(null).isSuccess).toBe(false);
  });

  it('Should be an integer > 1', async () => {
    expect(OfferAmount.create(0).isFailure).toBe(true);
    expect(OfferAmount.create(1).isSuccess).toBe(true);
  });
});
