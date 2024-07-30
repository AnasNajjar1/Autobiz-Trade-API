import { InMemorySaleRepo } from '../../../repos/implementations/inMemorySaleRepo';
import { DeleteSaleRequestDto } from './DeleteSaleRequestDto';
import { DeleteSaleUseCase } from './DeleteSaleUseCase';
import moment from 'moment';

let deleteSaleUseCase;
let tomorrow;

describe('Create a new Sale useCase', () => {
  beforeAll(() => {
    tomorrow = moment.utc().add(1, 'day').format();
    deleteSaleUseCase = new DeleteSaleUseCase(
      new InMemorySaleRepo([
        {
          id: 1,
          uuid: 'uuid1',
          validationStatus: 'DRAFT',
          acceptAuction: false,
          acceptSubmission: true,
          acceptImmediatePurchase: false,
          startDateTime: new Date(),
          endDateTime: tomorrow,
          vehicleId: 10,
          supplyType: 'STOCK',
        },
        {
          id: 2,
          uuid: 'uuid2',
          validationStatus: 'VALIDATED',
          acceptAuction: false,
          acceptSubmission: true,
          acceptImmediatePurchase: false,
          startDateTime: new Date(),
          endDateTime: tomorrow,
          vehicleId: 10,
          supplyType: 'STOCK',
        },
        {
          id: 3,
          uuid: 'uuid2',
          validationStatus: 'CANCELED',
          acceptAuction: false,
          acceptSubmission: true,
          acceptImmediatePurchase: false,
          startDateTime: new Date(),
          endDateTime: tomorrow,
          vehicleId: 10,
          supplyType: 'STOCK',
        },
      ]),
    );
  });

  it('can NOT delete an unknown sale', async () => {
    const deleteSaleOrError = await deleteSaleUseCase.execute({
      id: 666,
    });

    expect(deleteSaleOrError.isRight()).toEqual(false);
  });

  it('can delete a DRAFT sale', async () => {
    const deleteSaleOrError = await deleteSaleUseCase.execute({
      id: 1,
    });

    expect(deleteSaleOrError.isRight()).toEqual(true);
  });

  it('can NOT delete a VALIDATED sale', async () => {
    const deleteSaleOrError = await deleteSaleUseCase.execute({
      id: 2,
    });

    expect(deleteSaleOrError.isRight()).toEqual(false);
  });

  it('can delete a CANCELED sale', async () => {
    const deleteSaleOrError = await deleteSaleUseCase.execute({
      id: 3,
    });

    expect(deleteSaleOrError.isRight()).toEqual(true);
  });
});
