import { GroupMap } from '../../mappers/GroupMap';
import { InMemoryGroupRepo } from '../../repos/implementations/inMemoryGroupRepo';
import { CreateGroupUseCase } from './CreateGroupUseCase';

let createGroupUseCase;

describe('Create a new Group usecase', () => {
  beforeEach(() => {
    createGroupUseCase = new CreateGroupUseCase(
      new InMemoryGroupRepo([
        {
          id: 1,
          name: 'XXX',
        },
      ]),
    );
  });
  it('Should create a new group and return a new ID', async () => {
    const groupOrError = await createGroupUseCase.execute({
      name: 'YYY',
    });

    expect(groupOrError.isRight()).toEqual(true);
    const newGroup = GroupMap.toDto(groupOrError.value.getValue());
    expect(newGroup.id).toEqual(2);
    expect(newGroup.name).toEqual('YYY');
  });

  it('Should not create a new group without name', async () => {
    const groupOrError = await createGroupUseCase.execute({
      foo: 'bar',
    });

    expect(groupOrError.isLeft()).toEqual(true);
  });
});
