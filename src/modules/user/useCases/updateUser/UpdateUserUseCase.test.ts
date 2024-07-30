import { UserMap } from '../../mappers/UserMap';
import { InMemoryUserRepo } from '../../repos/implementations/inMemoryUserRepo';
import { UpdateUserUseCase } from './UpdateUserUseCase';

let updateUserUseCase;

describe('Update a User  usecase', () => {
  beforeEach(() => {
    updateUserUseCase = new UpdateUserUseCase(
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
  it('Should update a new user ', async () => {
    const userOrError = await updateUserUseCase.execute({
      id: 1,
      autobizUserId: 'FR_321',
      notificationNewPush: false,
      notificationAuction: true,
    });

    expect(userOrError.isRight()).toEqual(true);
    const updatedUser = UserMap.toDto(userOrError.value.getValue());
    expect(updatedUser.id).toEqual(1);
    expect(updatedUser.autobizUserId).toEqual('FR_321');
    expect(updatedUser.notificationDaily).toEqual(true);
    expect(updatedUser.notificationNewPush).toEqual(false);
    expect(updatedUser.notificationAuction).toEqual(true);
  });
});
