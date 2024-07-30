import { PointofsaleMap } from '../../mappers/PointofsaleMap';
import { InMemoryPointofsaleRepo } from '../../repos/implementations/inMemoryPointofsaleRepo';
import { UpdatePointofsaleUseCase } from './UpdatePointofsaleUseCase';
import { InMemoryAwsTranslateService } from '../../../../infra/translate/InMemoryAwsTranslateService';
let updatePointofsaleUseCase;

describe('Update a Pointofsale  usecase', () => {
  beforeEach(() => {
    updatePointofsaleUseCase = new UpdatePointofsaleUseCase(
      new InMemoryPointofsaleRepo([
        {
          id: 1,
          name: 'Pointofsale 1',
          picture: 'http://lorempixel.com/400/200/',
        },
      ]),
      new InMemoryAwsTranslateService(),
    );
  });
  it('Should update a new pointofsale ', async () => {
    const postedPointofsale = {
      id: 1,
      name: 'Pointofsale 1 bis',
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

    const pointofsaleOrError = await updatePointofsaleUseCase.execute(
      postedPointofsale,
    );

    expect(pointofsaleOrError.isRight()).toEqual(true);

    const updatedPointofsale = PointofsaleMap.toAdminFullDto(
      pointofsaleOrError.value.getValue(),
    );
    expect(updatedPointofsale).toEqual(
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
});
