import { UserMap } from '../../mappers/UserMap';
import { InMemoryUserRepo } from '../../repos/implementations/inMemoryUserRepo';
import { GetUserByAutobizUserIdErrors } from './GetUserByAutobizUserIdErrors';
import { GetUserByAutobizUserIdUseCase } from './GetUserByAutobizUserIdUseCase';

let getUserByAutobizUserIdUseCase;

describe('Get User By autobitUserId usecase', () => {
  beforeEach(() => {
    getUserByAutobizUserIdUseCase = new GetUserByAutobizUserIdUseCase(
      new InMemoryUserRepo([
        {
          id: 1,
          autobizUserId: 'FR_123',
          notificationDaily: true,
          notificationNewPush: true,
          notificationAuction: false,
        },
      ]),
    );
  });
  it('Should retrieve a user by id', async () => {
    const userOrError = await getUserByAutobizUserIdUseCase.execute({
      autobizUserId: 'FR123',
    });

    expect(userOrError.isRight()).toEqual(true);
    const user = UserMap.toDto(userOrError.value.getValue());
    expect(user.autobizUserId).toEqual('FR_123');
    expect(user.notificationDaily).toEqual(true);
    expect(user.notificationNewPush).toEqual(true);
    expect(user.notificationAuction).toEqual(false);
  });

  it('Should not retrieve non existent user', async () => {
    const userOrError = await getUserByAutobizUserIdUseCase.execute({
      autobizUserId: 'JP666',
    });

    expect(userOrError.isLeft()).toEqual(true);
    expect(userOrError.value.constructor).toEqual(
      GetUserByAutobizUserIdErrors.UserNotFoundError,
    );
  });
});
