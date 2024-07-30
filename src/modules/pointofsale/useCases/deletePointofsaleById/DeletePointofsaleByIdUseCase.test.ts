import { InMemoryPointofsaleRepo } from '../../repos/implementations/inMemoryPointofsaleRepo';
import { DeletePointofsaleByIdErrors } from './DeletePointofsaleByIdErrors';
import { DeletePointofsaleByIdUseCase } from './DeletePointofsaleByIdUseCase';

let deletePointofsaleByIdUseCase;

describe('Delete Pointofsale by Id usecase', () => {
  beforeEach(() => {
    deletePointofsaleByIdUseCase = new DeletePointofsaleByIdUseCase(
      new InMemoryPointofsaleRepo([
        {
          id: 1,
          mame: 'Pointofsale 1',
        },
      ]),
    );
  });
  it('Should delete a pointofsale by id', async () => {
    const result = await deletePointofsaleByIdUseCase.execute({
      id: 1,
    });

    expect(result.isRight()).toEqual(true);
  });

  it('Should not delete a non existent pointofsale', async () => {
    const result = await deletePointofsaleByIdUseCase.execute({
      id: 2,
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value.constructor).toEqual(
      DeletePointofsaleByIdErrors.PointofsaleNotFoundError,
    );
  });
});
