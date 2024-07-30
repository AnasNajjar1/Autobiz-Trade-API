import { IBrandRepo } from '../brandRepo';
import { BrandMap } from '../../mappers/BrandMap';
import { Brand, BrandProps } from '../../domain/brand';

export class InMemoryBrandRepo implements IBrandRepo {
  private mockedBrands;

  public constructor(mock?: any) {
    if (mock) {
      this.mockedBrands = mock;
    } else {
      this.mockedBrands = [
        {
          id: 1,
          name: 'BRAND XXX',
        },
        {
          id: 2,
          name: 'BRAND YYY',
        },
      ];
    }
  }

  public getBrands() {
    const brands = this.mockedBrands;

    const result = {
      limit: 24,
      offset: 0,
      rows: brands.map((p) => BrandMap.toDomain(p)),
      count: this.mockedBrands.length,
    };

    return Promise.resolve(result);
  }
}
