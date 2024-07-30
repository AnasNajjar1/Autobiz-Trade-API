import { SaleSupplyType } from './saleSupplyOfferType';

describe('SaleSupplyType types', () => {
  it('should be required', async () => {
    const result = SaleSupplyType.create(null);
    expect(result.isFailure).toBe(true);
  });

  it('should be valid when value is stock OR offerToPrivate', async () => {
    expect(SaleSupplyType.create('stock').isSuccess).toBe(true);
    expect(SaleSupplyType.create('offerToPrivate').isSuccess).toBe(true);
  });

  it('should not accept value is not stock or offerToPrivate', async () => {
    const result = SaleSupplyType.create('foo');
    expect(result.isFailure).toBe(true);
  });
});
