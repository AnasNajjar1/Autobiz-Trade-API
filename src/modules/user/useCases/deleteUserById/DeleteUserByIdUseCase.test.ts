import { InMemoryUserRepo } from '../../repos/implementations/inMemoryUserRepo';
import { DeleteUserByIdErrors } from './DeleteUserByIdErrors';
import { DeleteUserByIdUseCase } from './DeleteUserByIdUseCase';

let deleteUserByIdUseCase;

describe('Delete User by Id usecase', () => {
  beforeEach(() => {
    deleteUserByIdUseCase = new DeleteUserByIdUseCase(
      new InMemoryUserRepo([
        {
          id: 1,
          autobizUserId: 'FR_123',
        },
      ]),
    );
  });
  it('Should delete a user by id', async () => {
    const result = await deleteUserByIdUseCase.execute({
      id: 1,
    });

    expect(result.isRight()).toEqual(true);
  });

  it('Should not delete a non existent user', async () => {
    const result = await deleteUserByIdUseCase.execute({
      id: 2,
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value.constructor).toEqual(
      DeleteUserByIdErrors.UserNotFoundError,
    );
  });
});
