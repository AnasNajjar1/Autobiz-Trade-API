import { InMemoryDealerImporter } from '../../../../infra/import/dealer/InMemoryDealerImporter';
import { PointofsaleMap } from '../../mappers/PointofsaleMap';
import { InMemoryPointofsaleRepo } from '../../repos/implementations/inMemoryPointofsaleRepo';
import { CreatePointofsaleUseCase } from './CreatePointofsaleUseCase';
import { InMemoryAwsTranslateService } from '../../../../infra/translate/InMemoryAwsTranslateService';
let createPointofsaleUseCase;

describe('Create a new Pointofsale usecase', () => {
  beforeEach(() => {
    createPointofsaleUseCase = new CreatePointofsaleUseCase(
      new InMemoryPointofsaleRepo([
        {
          id: 1,
          name: 'Pointofsale 1',
          country: 'fr',
          zipCode: '75000',
          city: 'madrid',
        },
        {
          id: 2,
          name: 'Pointofsale 3',
          country: 'fr',
          zipCode: '75000',
          city: 'paris',
          company: 'Company 1',
        },
      ]),
      new InMemoryDealerImporter(),
      new InMemoryAwsTranslateService(),
    );
  });

  it('Should import a point of sale from autobiz API', async () => {
    const postedPointofsale = {
      action: 'import',
      autobizPosId: '11111', // Mocked in inMemory
      country: 'fr',
    };

    const pointofsaleOrError = await createPointofsaleUseCase.execute(
      postedPointofsale,
    );

    expect(pointofsaleOrError.isRight()).toEqual(true);
    const createdPointofsale = PointofsaleMap.toAdminFullDto(
      pointofsaleOrError.value.getValue(),
    );
    expect(typeof createdPointofsale.uuid).toBe('string');
    expect(createdPointofsale.name).toBeDefined();
    expect(createdPointofsale.zipCode).toBeDefined();
    expect(createdPointofsale.city).toBeDefined();
    expect(createdPointofsale.latitude).toBeDefined();
    expect(createdPointofsale.longitude).toBeDefined();
    expect(createdPointofsale.country).toBe(postedPointofsale.country);
    expect(createdPointofsale.autobizPosId).toBe(
      postedPointofsale.autobizPosId,
    );
  });

  it('Should create a new pointofsale from scratch', async () => {
    const postedPointofsale = {
      name: 'Pointofsale 2',
      picture: 'http://lorempixel.com/600/400/',
      info: '<p>Lorem</p>',
      paymentDeadline: '<p>Lorem</p>',
      pickupDeadline: '<p>Lorem</p>',
      comments: '<p>Lorem</p>',
      documentation: [
        { title: 'title', pdf: 'http://google.com' },
        { title: 'title2', pdf: 'http://autobiz.com' },
      ],
      city: 'Paris',
      zipCode: '75019',
      country: 'de',
      latitude: '48.927497',
      longitude: '2.345646',
    };

    const pointofsaleOrError = await createPointofsaleUseCase.execute(
      postedPointofsale,
    );

    expect(pointofsaleOrError.isRight()).toEqual(true);
    const createdPointofsale = PointofsaleMap.toAdminFullDto(
      pointofsaleOrError.value.getValue(),
    );
    expect(typeof createdPointofsale.uuid).toBe('string');
    expect(createdPointofsale).toEqual(
      expect.objectContaining({
        name: postedPointofsale.name,
        picture: postedPointofsale.picture,
        info: postedPointofsale.info,
        paymentDeadline: postedPointofsale.paymentDeadline,
        pickupDeadline: postedPointofsale.pickupDeadline,
        comments: postedPointofsale.comments,
        documentation: postedPointofsale.documentation,
        city: postedPointofsale.city,
        zipCode: postedPointofsale.zipCode,
        country: postedPointofsale.country,
        latitude: postedPointofsale.latitude,
        longitude: postedPointofsale.longitude,
      }),
    );
  });

  it('Should return a point of sale exist in database ', async () => {
    const postedPointofsale = {
      name: 'Pointofsale 3',
      country: 'fr',
      zipCode: '75000',
      city: 'paris',
      company: 'Company 1',
    };

    const pointofsaleOrError = await createPointofsaleUseCase.execute(
      postedPointofsale,
    );
    expect(pointofsaleOrError.isRight()).toEqual(true);
    const createdPointofsale = PointofsaleMap.toAdminFullDto(
      pointofsaleOrError.value.getValue(),
    );
    expect(createdPointofsale.id).toBeDefined();
    expect(typeof createdPointofsale.id).toEqual('number');
    expect(createdPointofsale.id).toEqual(2);
    expect(createdPointofsale.name).toEqual(postedPointofsale.name);
    expect(createdPointofsale.zipCode).toEqual(postedPointofsale.zipCode);
    expect(createdPointofsale.city).toEqual(postedPointofsale.city);
    expect(createdPointofsale.country).toEqual(postedPointofsale.country);
  });
});
