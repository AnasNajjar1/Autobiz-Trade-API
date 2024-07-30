import { InMemorySaleRepo } from '../../../repos/implementations/inMemorySaleRepo';
import { InMemoryVehicleRepo } from '../../../repos/implementations/inMemoryVehicleRepo';
import { InMemoryUserRepo } from '../../../../user/repos/implementations/inMemoryUserRepo';
import { InMemoryGroupRepo } from '../../../../group/repos/implementations/inMemoryGroupRepo';
import { CreateSaleRequestDto } from './CreateSaleRequestDto';
import { CreateSaleUseCase } from './CreateSaleUseCase';
import { InMemoryAwsTranslateService } from '../../../../../infra/translate/InMemoryAwsTranslateService';
import moment from 'moment';

let createSaleUseCase;
let yesterday;
let now;
let tomorrow;

describe('Create a new Sale useCase', () => {
  beforeAll(() => {
    createSaleUseCase = new CreateSaleUseCase(
      new InMemorySaleRepo(),
      new InMemoryVehicleRepo(),
      new InMemoryUserRepo(),
      new InMemoryGroupRepo(),
      new InMemoryAwsTranslateService()
    );
    now = new Date();
    tomorrow = moment.utc().add(1, 'day').format();
    yesterday = moment.utc().subtract(1, 'day').format();
  });

  it('create a new sale, generate a new id', async () => {
    const dto: CreateSaleRequestDto = {
      validationStatus: 'DRAFT',
      supplyType: 'STOCK',
      acceptAuction: false,
      acceptImmediatePurchase: false,
      acceptSubmission: true,
      auctionStartPrice: null,
      auctionStepPrice: null,
      auctionReservePrice: null,
      immediatePurchasePrice: null,
      startDateTime: now,
      endDateTime: tomorrow,
      comment: null,
      vehicleId: 1,
      createdBy: 'tester',
    };

    const saleOrError = await createSaleUseCase.execute(dto);

    expect(saleOrError.isRight()).toEqual(true);

    const newId = saleOrError.value.getValue();
    expect(typeof newId).toBe('number');
  });

  it('NOT create a sale without any acceptable supplyType', async () => {
    const dto: CreateSaleRequestDto = {
      validationStatus: 'DRAFT',
      supplyType: 'foo',
      acceptAuction: false,
      acceptImmediatePurchase: false,
      acceptSubmission: true,
      auctionStartPrice: null,
      auctionStepPrice: null,
      auctionReservePrice: null,
      immediatePurchasePrice: null,
      startDateTime: now,
      endDateTime: tomorrow,
      comment: null,
      vehicleId: 1,
      createdBy: 'tester',
    };

    const saleOrError = await createSaleUseCase.execute(dto);
    expect(saleOrError.isRight()).toEqual(false);
  });

  it('NOT create a sale with a endDateTime earlier as startDateTime', async () => {
    const dto: CreateSaleRequestDto = {
      validationStatus: 'DRAFT',
      supplyType: 'STOCK',
      acceptAuction: false,
      acceptImmediatePurchase: false,
      acceptSubmission: true,
      auctionStartPrice: null,
      auctionStepPrice: null,
      auctionReservePrice: null,
      immediatePurchasePrice: null,
      startDateTime: now,
      endDateTime: yesterday,
      comment: null,
      vehicleId: 1,
      createdBy: 'tester',
    };

    const saleOrError = await createSaleUseCase.execute(dto);
    expect(saleOrError.isRight()).toEqual(false);
  });

  it('create a sale with supplyType submission', async () => {
    const dto: CreateSaleRequestDto = {
      validationStatus: 'DRAFT',
      supplyType: 'STOCK',
      acceptAuction: false,
      acceptImmediatePurchase: false,
      acceptSubmission: true,
      auctionStartPrice: null,
      auctionStepPrice: null,
      auctionReservePrice: null,
      immediatePurchasePrice: null,
      startDateTime: now,
      endDateTime: tomorrow,
      comment: null,
      vehicleId: 1,
      createdBy: 'tester',
    };

    const saleOrError = await createSaleUseCase.execute(dto);
    expect(saleOrError.isRight()).toEqual(true);
  });

  it('create a sale with supplyType immediatePurchase', async () => {
    const dto: CreateSaleRequestDto = {
      validationStatus: 'DRAFT',
      supplyType: 'STOCK',
      acceptAuction: false,
      acceptImmediatePurchase: true,
      acceptSubmission: true,
      auctionStartPrice: null,
      auctionStepPrice: null,
      auctionReservePrice: null,
      immediatePurchasePrice: 100,
      startDateTime: now,
      endDateTime: tomorrow,
      comment: null,
      vehicleId: 1,
      createdBy: 'tester',
    };

    const saleOrError = await createSaleUseCase.execute(dto);
    expect(saleOrError.isRight()).toEqual(true);
  });

  it('NOT create a sale with supplyType immediatePurchase immediatePurchasePrice = 0', async () => {
    const dto: CreateSaleRequestDto = {
      validationStatus: 'DRAFT',
      supplyType: 'STOCK',
      acceptAuction: false,
      acceptImmediatePurchase: true,
      acceptSubmission: true,
      auctionStartPrice: null,
      auctionStepPrice: null,
      auctionReservePrice: null,
      immediatePurchasePrice: 0,
      startDateTime: now,
      endDateTime: tomorrow,
      comment: null,
      vehicleId: 1,
      createdBy: 'tester',
    };

    const saleOrError = await createSaleUseCase.execute(dto);
    expect(saleOrError.isRight()).toEqual(false);
  });

  it('create a sale with supplyType auction', async () => {
    const dto: CreateSaleRequestDto = {
      validationStatus: 'DRAFT',
      supplyType: 'STOCK',
      acceptAuction: true,
      acceptImmediatePurchase: true,
      acceptSubmission: true,
      auctionStartPrice: 1000,
      auctionStepPrice: 500,
      auctionReservePrice: null,
      immediatePurchasePrice: 2000,
      startDateTime: now,
      endDateTime: tomorrow,
      comment: null,
      vehicleId: 1,
      createdBy: 'tester',
    };

    const saleOrError = await createSaleUseCase.execute(dto);
    expect(saleOrError.isRight()).toEqual(true);
  });

  it('NOT create a sale type auction without auctionStartPrice', async () => {
    const dto: CreateSaleRequestDto = {
      validationStatus: 'DRAFT',
      supplyType: 'STOCK',
      acceptAuction: true,
      acceptImmediatePurchase: true,
      acceptSubmission: true,
      auctionStartPrice: 100,
      auctionStepPrice: 500,
      auctionReservePrice: null,
      immediatePurchasePrice: 0,
      startDateTime: now,
      endDateTime: tomorrow,
      comment: null,
      vehicleId: 1,
      createdBy: 'tester',
    };

    const saleOrError = await createSaleUseCase.execute(dto);
    expect(saleOrError.isRight()).toEqual(false);
  });

  it('NOT create a sale type auction without auctionStepPrice', async () => {
    const dto: CreateSaleRequestDto = {
      validationStatus: 'DRAFT',
      supplyType: 'STOCK',
      acceptAuction: true,
      acceptImmediatePurchase: true,
      acceptSubmission: true,
      auctionStartPrice: 1000,
      auctionStepPrice: null,
      auctionReservePrice: null,
      immediatePurchasePrice: 2000,
      startDateTime: now,
      endDateTime: tomorrow,
      comment: null,
      vehicleId: 1,
      createdBy: 'tester',
    };

    const saleOrError = await createSaleUseCase.execute(dto);
    expect(saleOrError.isRight()).toEqual(false);
  });

  it('NOT create a sale type auction without auctionStepPrice <= 0', async () => {
    const dto: CreateSaleRequestDto = {
      validationStatus: 'DRAFT',
      supplyType: 'STOCK',
      acceptAuction: true,
      acceptImmediatePurchase: true,
      acceptSubmission: true,
      auctionStartPrice: 1000,
      auctionStepPrice: 0,
      auctionReservePrice: null,
      immediatePurchasePrice: 2000,
      startDateTime: now,
      endDateTime: tomorrow,
      comment: null,
      vehicleId: 1,
      createdBy: 'tester',
    };

    const saleOrError = await createSaleUseCase.execute(dto);
    expect(saleOrError.isRight()).toEqual(false);
  });

  it('create a sale with supplyType auction with a auctionReservePrice', async () => {
    const dto: CreateSaleRequestDto = {
      validationStatus: 'DRAFT',
      supplyType: 'STOCK',
      acceptAuction: true,
      acceptImmediatePurchase: true,
      acceptSubmission: true,
      auctionStartPrice: 1000,
      auctionStepPrice: 500,
      auctionReservePrice: 3000,
      immediatePurchasePrice: 2000,
      startDateTime: now,
      endDateTime: tomorrow,
      comment: null,
      vehicleId: 1,
      createdBy: 'tester',
    };

    const saleOrError = await createSaleUseCase.execute(dto);
    expect(saleOrError.isRight()).toEqual(true);
  });

  it('create a expresssale with only vehicleId and supplyType default parameters', async () => {
    const dto = {
      supplyType: 'STOCK',
      vehicleId: 1,
      expressSale: true,
      createdBy: 'tester',
    };

    const saleOrError = await createSaleUseCase.execute(dto);

    expect(saleOrError.isRight()).toEqual(true);
  });
});
