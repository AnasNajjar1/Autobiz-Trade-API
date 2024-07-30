import { GroupMap } from '../../mappers/GroupMap';
import { InMemoryGroupRepo } from '../../repos/implementations/inMemoryGroupRepo';
import { UpdateGroupUseCase } from './UpdateGroupUseCase';

let updateGroupUseCase;

describe('Update a Group  usecase', () => {
  beforeEach(() => {
    updateGroupUseCase = new UpdateGroupUseCase(
      new InMemoryGroupRepo([
        {
          id: 1,
          name: 'XXX',
        },
      ]),
    );
  });
  it('Should update a new group ', async () => {
    const groupOrError = await updateGroupUseCase.execute({
      id: 1,
      name: 'YYY',
    });

    expect(groupOrError.isRight()).toEqual(true);
    const updatedGroup = GroupMap.toDto(groupOrError.value.getValue());
    expect(updatedGroup.id).toEqual(1);
    expect(updatedGroup.name).toEqual('YYY');
  });

  it('Should not update a new group without name', async () => {
    const groupOrError = await updateGroupUseCase.execute({
      foo: 'bar',
    });

    expect(groupOrError.isLeft()).toEqual(true);
  });
});
