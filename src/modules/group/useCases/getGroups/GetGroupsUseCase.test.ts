import { GroupMap } from '../../mappers/GroupMap';
import { InMemoryGroupRepo } from '../../repos/implementations/inMemoryGroupRepo';
import { GetGroupsUseCase } from './GetGroupsUseCase';

let getGroupByIdUseCase;
const mocked = [
  {
    id: 1,
    name: 'XXX',
  },
  {
    id: 2,
    name: 'YYY',
  },
];
describe('Get Groups', () => {
  beforeEach(() => {
    getGroupByIdUseCase = new GetGroupsUseCase(new InMemoryGroupRepo(mocked));
  });
  it('Should retrieve all groups', async () => {
    const groupsOrError = await getGroupByIdUseCase.execute();
    expect(groupsOrError.isRight()).toEqual(true);

    const groups = groupsOrError.value.getValue();

    expect(groups.count).toEqual(2);

    const rows = groups.rows.map((p) => GroupMap.toDto(p));

    expect(rows[0]).toEqual(mocked[0]);
    expect(rows[1]).toEqual(mocked[1]);
  });
});
