import { UserMap } from '../../mappers/UserMap';
import { InMemoryUserRepo } from '../../repos/implementations/inMemoryUserRepo';
import { GetUsersUseCase } from './GetUsersUseCase';

let getUsersByIdUseCase;
const mocked = [
  {
    id: 1,
    autobizUserId: 'FR_123',
    notificationDaily: true,
    notificationNewPush: true,
    notificationAuction: false,
  },
  {
    id: 2,
    autobizUserId: 'FR_321',
    notificationDaily: false,
    notificationNewPush: false,
    notificationAuction: true,
  },
];
describe('Get Users', () => {
  beforeEach(() => {
    getUsersByIdUseCase = new GetUsersUseCase(new InMemoryUserRepo(mocked));
  });
  it('Should retrieve all users', async () => {
    const usersOrError = await getUsersByIdUseCase.execute();
    expect(usersOrError.isRight()).toEqual(true);

    const users = usersOrError.value.getValue();

    expect(users.count).toEqual(2);

    const rows = users.rows.map((p) => UserMap.toDto(p));

    expect(rows[0].autobizUserId).toBe(mocked[0].autobizUserId);
    expect(rows[1].autobizUserId).toBe(mocked[1].autobizUserId);
  });
});
