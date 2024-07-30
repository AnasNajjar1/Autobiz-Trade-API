import { UserMap } from '../../mappers/UserMap';
import { InMemoryUserRepo } from '../../repos/implementations/inMemoryUserRepo';
import { GetUserByIdErrors } from './GetUserByIdErrors';
import { GetUserByIdUseCase } from './GetUserByIdUseCase';

let getUserByIdUseCase;

describe('Get User By Id usecase', () => {
  beforeEach(() => {
    getUserByIdUseCase = new GetUserByIdUseCase(
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
    const userOrError = await getUserByIdUseCase.execute({
      id: 1,
    });

    expect(userOrError.isRight()).toEqual(true);
    const user = UserMap.toDto(userOrError.value.getValue());
    expect(user.autobizUserId).toEqual('FR_123');
    expect(user.notificationDaily).toEqual(true);
    expect(user.notificationNewPush).toEqual(true);
    expect(user.notificationAuction).toEqual(false);
  });

  it('Should not retrieve non existent user', async () => {
    const userOrError = await getUserByIdUseCase.execute({
      id: 2,
    });

    expect(userOrError.isLeft()).toEqual(true);
    expect(userOrError.value.constructor).toEqual(
      GetUserByIdErrors.UserNotFoundError,
    );
  });
});
