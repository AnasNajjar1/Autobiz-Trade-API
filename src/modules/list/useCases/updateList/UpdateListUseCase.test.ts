import { ListMap } from '../../mappers/ListMap';
import { InMemoryListRepo } from '../../repos/implementations/inMemoryListRepo';
import { UpdateListUseCase } from './UpdateListUseCase';

let updateListUseCase;

describe('Update a List  usecase', () => {
  beforeEach(() => {
    updateListUseCase = new UpdateListUseCase(
      new InMemoryListRepo([
        {
          id: 1,
          name: 'Liste 1',
          picture: 'http://lorempixel.com/400/200/',
        },
      ]),
    );
  });
  it('Should update a new list ', async () => {
    const listOrError = await updateListUseCase.execute({
      id: 1,
      name: 'Liste 1 bis',
      picture: 'http://lorempixel.com/600/400/',
    });

    expect(listOrError.isRight()).toEqual(true);
    const updatedList = ListMap.toAdminDto(listOrError.value.getValue());
    expect(updatedList.id).toEqual(1);
    expect(updatedList.name).toEqual('Liste 1 bis');
    expect(updatedList.picture).toEqual('http://lorempixel.com/600/400/');
  });
});
