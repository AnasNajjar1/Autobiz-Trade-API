import { BrandMap } from '../../mappers/BrandMap';
import { InMemoryBrandRepo } from '../../repos/implementations/inMemoryBrandRepo';
import { GetBrandsUseCase } from './GetBrandsUseCase';

let getBrandsByIdUseCase;
const mocked = [
  {
    id: 1,
    name: 'renault',
  },
  {
    id: 2,
    name: 'peugeot',
  },
];
describe('Get Brands', () => {
  beforeEach(() => {
    getBrandsByIdUseCase = new GetBrandsUseCase(new InMemoryBrandRepo(mocked));
  });
  it('Should retrieve all brands', async () => {
    const brandsOrError = await getBrandsByIdUseCase.execute();
    expect(brandsOrError.isRight()).toEqual(true);

    const brands = brandsOrError.value.getValue();

    expect(brands.count).toEqual(2);

    const rows = brands.rows.map((p) => BrandMap.toDto(p));

    expect(rows[0].name).toBe(mocked[0].name);
    expect(rows[1].name).toBe(mocked[1].name);
  });

  it('Should replace id by name', async () => {
    const brandsOrError = await getBrandsByIdUseCase.execute();
    expect(brandsOrError.isRight()).toEqual(true);

    const brands = brandsOrError.value.getValue();

    const rows = brands.rows.map((p) => BrandMap.toDto(p));

    expect(rows[0].name).toBe(mocked[0].name);
    expect(rows[0].id).toBe(mocked[0].name);
  });
});
