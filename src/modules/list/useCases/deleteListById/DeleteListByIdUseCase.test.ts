import { InMemoryListRepo } from '../../repos/implementations/inMemoryListRepo';
import { DeleteListByIdErrors } from './DeleteListByIdErrors';
import { DeleteListByIdUseCase } from './DeleteListByIdUseCase';

let deleteListByIdUseCase;

describe('Delete List by Id usecase', () => {
  beforeEach(() => {
    deleteListByIdUseCase = new DeleteListByIdUseCase(
      new InMemoryListRepo([
        {
          id: 1,
          mame: 'Liste 1',
        },
      ]),
    );
  });
  it('Should delete a list by id', async () => {
    const result = await deleteListByIdUseCase.execute({
      id: 1,
    });

    expect(result.isRight()).toEqual(true);
  });

  it('Should not delete a non existent list', async () => {
    const result = await deleteListByIdUseCase.execute({
      id: 2,
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value.constructor).toEqual(
      DeleteListByIdErrors.ListNotFoundError,
    );
  });
});
