import { PointofsaleMap } from '../../mappers/PointofsaleMap';
import { InMemoryPointofsaleRepo } from '../../repos/implementations/inMemoryPointofsaleRepo';
import { GetPointofsaleByIdErrors } from './GetPointofsaleByIdErrors';
import { GetPointofsaleByIdUseCase } from './GetPointofsaleByIdUseCase';

let getPointofsaleByIdUseCase;

describe('Get Pointofsale By Id usecase', () => {
  beforeEach(() => {
    getPointofsaleByIdUseCase = new GetPointofsaleByIdUseCase(
      new InMemoryPointofsaleRepo([
        {
          id: 1,
          name: 'Pointofsale 1',
          picture: 'http://lorempixel.com/400/200/',
        },
      ]),
    );
  });
  it('Should retrieve a pointofsale by id', async () => {
    const pointofsaleOrError = await getPointofsaleByIdUseCase.execute({
      id: 1,
    });

    expect(pointofsaleOrError.isRight()).toEqual(true);
    const pointofsale = PointofsaleMap.toAdminFullDto(
      pointofsaleOrError.value.getValue(),
    );
    expect(pointofsale.name).toEqual('Pointofsale 1');
  });

  it('Should not retrieve non existent pointofsale', async () => {
    const pointofsaleOrError = await getPointofsaleByIdUseCase.execute({
      id: 2,
    });

    expect(pointofsaleOrError.isLeft()).toEqual(true);
    expect(pointofsaleOrError.value.constructor).toEqual(
      GetPointofsaleByIdErrors.PointofsaleNotFoundError,
    );
  });
});
