import { GroupMap } from '../../mappers/GroupMap';
import { InMemoryGroupRepo } from '../../repos/implementations/inMemoryGroupRepo';
import { GetGroupByIdErrors } from './GetGroupByIdErrors';
import { GetGroupByIdUseCase } from './GetGroupByIdUseCase';

let getsGroupByIdUseCase;

describe('Get Group By Id usecase', () => {
  beforeEach(() => {
    getsGroupByIdUseCase = new GetGroupByIdUseCase(
      new InMemoryGroupRepo([
        {
          id: 1,
          name: 'XXX',
        },
      ]),
    );
  });
  it('Should retrieve a group by id', async () => {
    const groupOrError = await getsGroupByIdUseCase.execute({
      id: 1,
    });

    expect(groupOrError.isRight()).toEqual(true);
    const group = GroupMap.toDto(groupOrError.value.getValue());
    expect(group.name).toEqual('XXX');
  });

  it('Should not retrieve non existent group', async () => {
    const groupOrError = await getsGroupByIdUseCase.execute({
      id: 2,
    });

    expect(groupOrError.isLeft()).toEqual(true);
    expect(groupOrError.value.constructor).toEqual(
      GetGroupByIdErrors.GroupNotFoundError,
    );
  });
});
