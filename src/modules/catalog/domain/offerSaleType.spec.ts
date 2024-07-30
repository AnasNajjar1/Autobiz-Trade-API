import { OfferSaleType } from './offerSaleType';

describe('VehicleFileNumber types', () => {
  it('shoube be required', async () => {
    expect(OfferSaleType.create('').isSuccess).toBe(false);
    expect(OfferSaleType.create(null).isSuccess).toBe(false);
  });

  it('should be valid when value is auction OR submission OR immediatePurchase', async () => {
    expect(OfferSaleType.create('auction').isSuccess).toBe(true);
    expect(OfferSaleType.create('submission').isSuccess).toBe(true);
    expect(OfferSaleType.create('immediatePurchase').isSuccess).toBe(true);
  });

  it('should not accept value than auction OR submission OR immediatePurchase', async () => {
    expect(OfferSaleType.create('FOO').isSuccess).toBe(false);
  });
});
