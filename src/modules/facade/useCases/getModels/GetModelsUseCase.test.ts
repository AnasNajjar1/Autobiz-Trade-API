import { ModelMap } from '../../mappers/ModelMap';
import { InMemoryModelRepo } from '../../repos/implementations/inMemoryModelRepo';
import { GetModelsUseCase } from './GetModelsUseCase';

let getModelsByIdUseCase;
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
describe('Get Models', () => {
  beforeEach(() => {
    getModelsByIdUseCase = new GetModelsUseCase(new InMemoryModelRepo(mocked));
  });
  it('Should retrieve all models', async () => {
    const modelsOrError = await getModelsByIdUseCase.execute();
    expect(modelsOrError.isRight()).toEqual(true);

    const models = modelsOrError.value.getValue();

    expect(models.count).toEqual(2);

    const rows = models.rows.map((p) => ModelMap.toDto(p));

    expect(rows[0].name).toBe(mocked[0].name);
    expect(rows[1].name).toBe(mocked[1].name);
  });

  it('Should replace id by name', async () => {
    const modelsOrError = await getModelsByIdUseCase.execute();
    expect(modelsOrError.isRight()).toEqual(true);

    const models = modelsOrError.value.getValue();

    const rows = models.rows.map((p) => ModelMap.toDto(p));

    expect(rows[0].name).toBe(mocked[0].name);
    expect(rows[0].id).toBe(mocked[0].name);
  });
});
