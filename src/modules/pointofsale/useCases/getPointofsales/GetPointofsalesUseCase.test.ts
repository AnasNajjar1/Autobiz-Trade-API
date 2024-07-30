import { PointofsaleMap } from '../../mappers/PointofsaleMap';
import { InMemoryPointofsaleRepo } from '../../repos/implementations/inMemoryPointofsaleRepo';
import { GetPointofsalesUseCase } from './GetPointofsalesUseCase';

let getPointofsalesByIdUseCase;
const mocked = [
  {
    id: 1,
    name: 'Pointofsale 1',
    picture: 'http://lorempixel.com/400/200/',
  },
  {
    id: 2,
    name: 'Pointofsale 2',
    picture: 'http://lorempixel.com/600/400/',
  },
];
describe('Get Pointofsales', () => {
  beforeEach(() => {
    getPointofsalesByIdUseCase = new GetPointofsalesUseCase(
      new InMemoryPointofsaleRepo(mocked),
    );
  });
  it('Should retrieve all pointofsales', async () => {
    const pointofsalesOrError = await getPointofsalesByIdUseCase.execute();
    expect(pointofsalesOrError.isRight()).toEqual(true);

    const pointofsales = pointofsalesOrError.value.getValue();

    expect(pointofsales.count).toEqual(2);

    const rows = pointofsales.rows.map((p) =>
      PointofsaleMap.toAdminShortDto(p),
    );

    expect(rows[0].name).toBe(mocked[0].name);
    expect(rows[1].name).toBe(mocked[1].name);
  });
});
