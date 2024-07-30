import { InMemoryMessenger } from '../../../../../infra/messenger/implementations/InMemoryMessenger';
import { InMemorySaleRepo } from '../../../repos/implementations/inMemorySaleRepo';
import { UpdateSaleUseCase } from './UpdateSaleUseCase';

let updateSaleUseCase;
let now;
let future;

describe('validate a Sale Status useCase', () => {
  const messenger = new InMemoryMessenger({ execute: () => {} });
  beforeAll(() => {
    updateSaleUseCase = new UpdateSaleUseCase(
      new InMemorySaleRepo([
        {
          id: 1,
          validationStatus: 'DRAFT',
          acceptSubmission: true,
          acceptImmediatePurchase: false,
          startDateTime: new Date(),
          endDateTime: new Date('2050-12-06T07:34:10Z'),
          acceptAuction: false,
          vehicleId: 1,
          supplyType: 'STOCK',
        },
        {
          id: 2,
          validationStatus: 'VALIDATED',
          acceptSubmission: true,
          acceptImmediatePurchase: false,
          startDateTime: new Date(),
          endDateTime: new Date('2050-12-06T07:34:10Z'),
          acceptAuction: false,
          vehicleId: 1,
          supplyType: 'STOCK',
        },
        {
          id: 3,
          validationStatus: 'CANCELED',
          acceptSubmission: true,
          acceptImmediatePurchase: false,
          startDateTime: new Date(),
          endDateTime: new Date('2050-12-06T07:34:10Z'),
          acceptAuction: false,
          vehicleId: 1,
          supplyType: 'STOCK',
        },
        {
          id: 4,
          validationStatus: 'DRAFT',
          acceptSubmission: true,
          acceptImmediatePurchase: false,
          startDateTime: new Date(),
          endDateTime: new Date('2050-12-06T07:34:10Z'),
          acceptAuction: false,
          vehicleId: 2,
          supplyType: 'STOCK',
        },
      ]),
      messenger,
    );
  });

  it('validates a DRAFT sale', async () => {
    const saleOrError = await updateSaleUseCase.execute({
      id: 4,
      validationStatus: 'VALIDATED',
    });

    expect(saleOrError.isRight()).toEqual(true);

    const sale = saleOrError.value.getValue();
    expect(sale.validationStatus).toEqual('VALIDATED');
  });

  it('not validates a DRAFT sale when there is already a VALIDATED sale for a vehicle', async () => {
    const saleOrError = await updateSaleUseCase.execute({
      id: 1,
      validationStatus: 'VALIDATED',
    });

    expect(saleOrError.isRight()).toEqual(false);
  });

  it('cancels a DRAFT sale', async () => {
    const saleOrError = await updateSaleUseCase.execute({
      id: 1,
      validationStatus: 'CANCELED',
    });

    expect(saleOrError.isRight()).toEqual(true);
    const sale = saleOrError.value.getValue();
    expect(sale.validationStatus).toEqual('CANCELED');
  });

  it('cancels a VALIDATED sale', async () => {
    const saleOrError = await updateSaleUseCase.execute({
      id: 2,
      validationStatus: 'CANCELED',
    });

    expect(saleOrError.isRight()).toEqual(true);
    const sale = saleOrError.value.getValue();
    expect(sale.validationStatus).toEqual('CANCELED');
  });

  it('not draft a VALIDATED sale', async () => {
    const saleOrError = await updateSaleUseCase.execute({
      id: 2,
      validationStatus: 'DRAFT',
    });

    expect(saleOrError.isRight()).toEqual(false);
  });

  it('not validates a CANCELED sale', async () => {
    const saleOrError = await updateSaleUseCase.execute({
      id: 3,
      validationStatus: 'VALIDATED',
    });

    expect(saleOrError.isRight()).toEqual(false);
  });

  it('not draft a CANCELED sale', async () => {
    const saleOrError = await updateSaleUseCase.execute({
      id: 3,
      validationStatus: 'DRAFT',
    });

    expect(saleOrError.isRight()).toEqual(false);
  });
});
