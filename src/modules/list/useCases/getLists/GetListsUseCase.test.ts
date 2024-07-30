import { ListMap } from '../../mappers/ListMap';
import { InMemoryListRepo } from '../../repos/implementations/inMemoryListRepo';
import { GetListsUseCase } from './GetListsUseCase';

let getListsByIdUseCase;
const mocked = [
  {
    id: 1,
    name: 'Liste 1',
    picture: 'http://lorempixel.com/400/200/',
  },
  {
    id: 2,
    name: 'Liste 2',
    picture: 'http://lorempixel.com/600/400/',
  },
];
describe('Get Lists', () => {
  beforeEach(() => {
    getListsByIdUseCase = new GetListsUseCase(new InMemoryListRepo(mocked));
  });
  it('Should retrieve all lists', async () => {
    const listsOrError = await getListsByIdUseCase.execute();

    expect(listsOrError.isRight()).toEqual(true);

    const lists = listsOrError.value.getValue();

    expect(lists.count).toEqual(2);

    const rows = lists.rows.map((p) => ListMap.toAdminDto(p));

    expect(rows[0].name).toBe(mocked[0].name);
    expect(rows[1].name).toBe(mocked[1].name);
  });
});
