import { InMemoryGeoCode } from '../../../../../infra/geocode/InMemoryGeoCode';
import { GetPositionFromZipcodeUseCase } from './GetPositionFromZipcodeUseCase';

let getPositionFromZipcodeUseCase;

describe('get Position from Zipcode / country usecase', () => {
  beforeEach(() => {
    getPositionFromZipcodeUseCase = new GetPositionFromZipcodeUseCase(
      new InMemoryGeoCode(),
    );
  });
  it('retrieves longitude and latitude from 75001 France ', async () => {
    const positionOrError = await getPositionFromZipcodeUseCase.execute({
      zipCode: '75001',
      country: 'france',
    });
    const position = positionOrError.value.getValue();
    expect(positionOrError.isRight()).toEqual(true);
    expect(position.lat).toBeDefined();
    expect(position.lng).toBeDefined();
  });
});

describe('get Position from Zipcode / country usecase', () => {
  beforeEach(() => {
    getPositionFromZipcodeUseCase = new GetPositionFromZipcodeUseCase(
      new InMemoryGeoCode(),
    );
  });
  it('retrieves an error when i search an non existing zipcode ', async () => {
    const positionOrError = await getPositionFromZipcodeUseCase.execute({
      zipCode: '66666',
      country: 'hell',
    });
    expect(positionOrError.isRight()).toEqual(false);
  });
});
