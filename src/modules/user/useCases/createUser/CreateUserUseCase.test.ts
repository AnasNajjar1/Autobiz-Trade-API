import { UserMap } from '../../mappers/UserMap';
import { InMemoryUserRepo } from '../../repos/implementations/inMemoryUserRepo';
import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase;

describe('Create a new User usecase', () => {
  beforeEach(() => {
    createUserUseCase = new CreateUserUseCase(
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
  it('Should create a new user and return a new ID', async () => {
    const userOrError = await createUserUseCase.execute({
      autobizUserId: 'FR_321',
      notificationDaily: true,
      notificationNewPush: true,
      notificationAuction: false,
    });

    expect(userOrError.isRight()).toEqual(true);
    const newUser = UserMap.toDto(userOrError.value.getValue());
    expect(newUser.id).toEqual(2);
    expect(newUser.autobizUserId).toEqual('FR_321');
    expect(newUser.notificationDaily).toEqual(true);
    expect(newUser.notificationNewPush).toEqual(true);
    expect(newUser.notificationAuction).toEqual(false);
  });

  it('Should not create a new user without autobizUserId', async () => {
    const userOrError = await createUserUseCase.execute({
      foo: 'bar',
    });

    expect(userOrError.isLeft()).toEqual(true);
  });
});
