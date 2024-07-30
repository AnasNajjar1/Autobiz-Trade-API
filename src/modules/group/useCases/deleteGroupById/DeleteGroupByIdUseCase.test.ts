import { InMemoryGroupRepo } from '../../repos/implementations/inMemoryGroupRepo';
import { DeleteGroupByIdErrors } from './DeleteGroupByIdErrors';
import { DeleteGroupByIdUseCase } from './DeleteGroupByIdUseCase';

let deleteGroupByIdUseCase;

describe('Delete Group by Id usecase', () => {
  beforeEach(() => {
    deleteGroupByIdUseCase = new DeleteGroupByIdUseCase(
      new InMemoryGroupRepo([
        {
          id: 1,
          name: 'XXX',
        },
      ]),
    );
  });
  it('Should delete a group by id', async () => {
    const result = await deleteGroupByIdUseCase.execute({
      id: 1,
    });

    expect(result.isRight()).toEqual(true);
  });

  it('Should not delete a non existent group', async () => {
    const result = await deleteGroupByIdUseCase.execute({
      id: 2,
    });

    expect(result.isLeft()).toEqual(true);
    expect(result.value.constructor).toEqual(
      DeleteGroupByIdErrors.GroupNotFoundError,
    );
  });
});
