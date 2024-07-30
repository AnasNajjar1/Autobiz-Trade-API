import { ListMap } from '../../mappers/ListMap';
import { InMemoryListRepo } from '../../repos/implementations/inMemoryListRepo';
import { GetListByIdErrors } from './GetListByIdErrors';
import { GetListByIdUseCase } from './GetListByIdUseCase';

let getListByIdUseCase;

describe('Get List By Id usecase', () => {
  beforeEach(() => {
    getListByIdUseCase = new GetListByIdUseCase(
      new InMemoryListRepo([
        {
          id: 1,
          uuid: '123',
          name: 'Liste 1',
          picture: 'http://lorempixel.com/400/200/',
        },
      ]),
    );
  });
  it('Should retrieve a list by id', async () => {
    const listOrError = await getListByIdUseCase.execute({
      id: 1,
    });

    expect(listOrError.isRight()).toEqual(true);
    const list = ListMap.toAdminDto(listOrError.value.getValue());
    expect(list.name).toEqual('Liste 1');
  });

  it('Should not retrieve non existent list', async () => {
    const listOrError = await getListByIdUseCase.execute({
      id: 2,
    });

    expect(listOrError.isLeft()).toEqual(true);
    expect(listOrError.value.constructor).toEqual(
      GetListByIdErrors.ListNotFoundError,
    );
  });
});
