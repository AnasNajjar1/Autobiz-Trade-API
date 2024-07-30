import { ListMap } from '../../mappers/ListMap';
import { InMemoryListRepo } from '../../repos/implementations/inMemoryListRepo';
import { CreateListUseCase } from './CreateListUseCase';

let createListUseCase;

describe('Create a new List usecase', () => {
  beforeEach(() => {
    createListUseCase = new CreateListUseCase(
      new InMemoryListRepo([
        {
          id: 1,
          name: 'Liste 1',
        },
      ]),
    );
  });

  it('Should not create a list with an existing list name', async () => {
    const listOrError = await createListUseCase.execute({
      name: 'Liste 1',
    });
    expect(listOrError.isLeft()).toEqual(true);
  });

  it('Should create a new list ', async () => {
    const postedList = {
      name: 'Liste 2',
      picture: 'http://lorempixel.com/400/200/',
      startDateTime: new Date(),
      endDateTime: new Date(),
      groupId: 1,
    };

    const listOrError = await createListUseCase.execute(postedList);

    expect(listOrError.isRight()).toEqual(true);
    const createdList = ListMap.toAdminDto(listOrError.value.getValue());
    expect(typeof createdList.uuid).toBe('string');
    expect(createdList).toEqual(
      expect.objectContaining({
        id: 2,
        name: postedList.name,
        picture: postedList.picture,
        startDateTime: postedList.startDateTime,
        endDateTime: postedList.endDateTime,
        groupId: postedList.groupId,
      }),
    );
  });
});
