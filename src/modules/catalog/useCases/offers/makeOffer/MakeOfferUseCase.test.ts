import moment from 'moment';
import { Sale } from '../../../domain/sale';
import { saleService } from '../../../domain/services';
import { SaleService } from '../../../domain/services/saleService';
import { InMemoryOfferRepo } from '../../../repos/implementations/inMemoryOfferRepo';
import { InMemorySaleRepo } from '../../../repos/implementations/inMemorySaleRepo';
import { MakeOfferErrors } from './MakeOfferErrors';
import { MakeOfferUseCase } from './MakeOfferUseCase';

let makeOfferUseCase;
let inOneMinute;
let userId;
let tomorrow;

describe('Make Offer usecase', () => {
  beforeEach(() => {
    tomorrow = moment().add(1, 'day').utc().format();
    inOneMinute = moment().add(60, 'second').utc().format();
    makeOfferUseCase = new MakeOfferUseCase(
      new InMemorySaleRepo([
        // Auction + Immediate Purchase + submission
        {
          id: 1,
          uuid: 'uuid1',
          validationStatus: 'VALIDATED',
          acceptAuction: true,
          acceptSubmission: true,
          acceptImmediatePurchase: true,
          auctionStartPrice: 1000,
          auctionStepPrice: 500,

          immediatePurchasePrice: 5000,
          supplyType: 'STOCK',
          salesStat: {
            secondsBeforeStart: -5000,
            secondsBeforeEnd: 5000,
            status: 'LIVE',
          },
          startDateTime: new Date(),
          endDateTime: tomorrow,
          vehicleId: 10,
          minimalAuction: 2000,
          countAuctions: 0,
        },
        // only Auction
        {
          id: 2,
          uuid: 'uuid2',
          validationStatus: 'VALIDATED',
          acceptAuction: true,
          acceptSubmission: false,
          acceptImmediatePurchase: false,
          auctionStartPrice: 1000,
          auctionStepPrice: 500,
          supplyType: 'STOCK',
          salesStat: {
            secondsBeforeStart: -5000,
            secondsBeforeEnd: 5000,
            status: 'LIVE',
          },
          startDateTime: new Date(),
          endDateTime: tomorrow,
          vehicleId: 10,
          minimalAuction: 2000,
          bestAuction: 1500,
          countAuctions: 1,
        },
        // only ImmediatePurchase
        {
          id: 3,
          uuid: 'uuid3',
          validationStatus: 'VALIDATED',
          acceptAuction: false,
          acceptSubmission: false,
          acceptImmediatePurchase: true,
          immediatePurchasePrice: 5000,
          supplyType: 'STOCK',
          salesStat: {
            secondsBeforeStart: -5000,
            secondsBeforeEnd: 5000,
            status: 'LIVE',
          },
          startDateTime: new Date(),
          endDateTime: tomorrow,
          vehicleId: 10,
        },
        // only submission
        {
          id: 4,
          uuid: 'uuid4',
          validationStatus: 'VALIDATED',
          acceptAuction: false,
          acceptSubmission: true,
          acceptImmediatePurchase: false,
          supplyType: 'STOCK',
          salesStat: {
            secondsBeforeStart: -5000,
            secondsBeforeEnd: 5000,
            status: 'LIVE',
          },
          startDateTime: new Date(),
          endDateTime: tomorrow,
          vehicleId: 10,
        },
        // not active
        {
          id: 5,
          uuid: 'uuid5',
          validationStatus: 'VALIDATED',
          acceptAuction: false,
          acceptSubmission: true,
          acceptImmediatePurchase: false,
          supplyType: 'STOCK',
          salesStat: {
            secondsBeforeStart: -15000,
            secondsBeforeEnd: -5000,
            status: 'CLOSED',
          },
          startDateTime: new Date(),
          endDateTime: tomorrow,
          vehicleId: 10,
        },
        // auction + closing in less than 3 minutes
        {
          id: 6,
          uuid: 'uuid6',
          validationStatus: 'VALIDATED',
          acceptAuction: true,
          acceptSubmission: false,
          acceptImmediatePurchase: false,
          auctionStartPrice: 1000,
          auctionStepPrice: 500,
          supplyType: 'STOCK',
          salesStat: {
            secondsBeforeStart: -5000,
            secondsBeforeEnd: 5000,
            status: 'LIVE',
          },
          startDateTime: new Date(),
          endDateTime: inOneMinute,
          vehicleId: 10,
          minimalAuction: 2000,
          bestAuction: 1500,
          countAuctions: 1,
        },
        // submission + auction with reservePrice Reached
        {
          id: 7,
          uuid: 'uuid7',
          validationStatus: 'VALIDATED',
          acceptAuction: true,
          acceptSubmission: true,
          acceptImmediatePurchase: false,
          auctionStartPrice: 1000,
          auctionStepPrice: 500,
          auctionReservePrice: 1500,
          startDateTime: new Date(),
          supplyType: 'STOCK',
          salesStat: {
            secondsBeforeStart: -5000,
            secondsBeforeEnd: 5000,
            status: 'LIVE',
          },
          endDateTime: inOneMinute,
          vehicleId: 10,
          minimalAuction: 2000,
          bestAuction: 2000,
          countAuctions: 1,
        },
        // submission + auction with reservePrice Not Reached
        {
          id: 8,
          uuid: 'uuid8',
          validationStatus: 'VALIDATED',
          supplyType: 'STOCK',
          salesStat: {
            secondsBeforeStart: -5000,
            secondsBeforeEnd: 5000,
            status: 'LIVE',
          },
          acceptAuction: true,
          acceptSubmission: true,
          acceptImmediatePurchase: false,
          auctionStartPrice: 1000,
          auctionStepPrice: 500,
          auctionReservePrice: 5000,
          startDateTime: new Date(),
          endDateTime: inOneMinute,
          vehicleId: 10,
          minimalAuction: 2000,
          bestAuction: 1500,
          countAuctions: 1,
        },
      ]),
      new InMemoryOfferRepo(),
    );
    userId = 'john';
  });
  it('can NOT make a offer for an unknown sale', async () => {
    const makeOfferOrError = await makeOfferUseCase.execute({
      userId: '1',
      offerType: 'submission',
      amount: 300,
      saleUuid: 'bar',
    });

    expect(makeOfferOrError.isRight()).toEqual(false);
  });

  it('can NOT make a offer for non active sale', async () => {
    const makeOfferOrError = await makeOfferUseCase.execute({
      userId: '1',
      offerType: 'submission',
      amount: 300,
      saleUuid: 'uuid5',
    });

    expect(makeOfferOrError.isRight()).toEqual(false);
  });

  it('can NOT make a offer without an acceptable offerType', async () => {
    const makeOfferOrError = await makeOfferUseCase.execute({
      userId: '1',
      offerType: 'foo',
      amount: 200,
      saleUuid: 'uuid1',
    });

    expect(makeOfferOrError.isRight()).toEqual(false);
  });

  it('can make a submission', async () => {
    const makeOfferOrError = await makeOfferUseCase.execute({
      userId: '1',
      offerType: 'submission',
      amount: 200,
      saleUuid: 'uuid1',
    });

    expect(makeOfferOrError.isRight()).toEqual(true);
  });

  it('can NOT make a submission under 200', async () => {
    const makeOfferOrError = await makeOfferUseCase.execute({
      userId: '1',
      offerType: 'submission',
      amount: 199,
      saleUuid: 'uuid1',
    });

    expect(makeOfferOrError.isRight()).toEqual(false);
  });

  it('can NOT make a submission if submission is not accepted', async () => {
    const makeOfferOrError = await makeOfferUseCase.execute({
      userId: '1',
      offerType: 'submission',
      amount: 200,
      saleUuid: 'uuid2',
    });

    expect(makeOfferOrError.isRight()).toEqual(false);
  });

  // 7 submission + auction with reservePrice Reached
  // 8 submission + auction with reservePrice NOT Reached

  it('can make a submission if there is auctions only if reserve price not reached', async () => {
    const makeOfferOrError = await makeOfferUseCase.execute({
      userId: '1',
      offerType: 'submission',
      amount: 300,
      saleUuid: 'uuid8',
    });

    expect(makeOfferOrError.isRight()).toEqual(true);
  });

  it('can NOT make a submission if there is auctions with reached reserve price', async () => {
    const makeOfferOrError = await makeOfferUseCase.execute({
      userId: '1',
      offerType: 'submission',
      amount: 300,
      saleUuid: 'uuid7',
    });

    expect(makeOfferOrError.isRight()).toEqual(false);
  });

  it('can make a immediate purchase if amount is immediatePurchasePrice', async () => {
    const makeOfferOrError = await makeOfferUseCase.execute({
      userId: '1',
      offerType: 'immediatePurchase',
      amount: 5000,
      saleUuid: 'uuid1',
    });

    expect(makeOfferOrError.isRight()).toEqual(true);
  });

  it('can NOT make a immediate purchase if amount is NOT immediatePurchasePrice', async () => {
    const makeOfferOrError = await makeOfferUseCase.execute({
      userId: '1',
      offerType: 'immediatePurchase',
      amount: 3000,
      saleUuid: 'uuid1',
    });

    expect(makeOfferOrError.isRight()).toEqual(false);
  });

  it('can NOT make a immediatePurchase if immediatePurchase is not accepted', async () => {
    const makeOfferOrError = await makeOfferUseCase.execute({
      userId: '1',
      offerType: 'immediatePurchase',
      amount: 5000,
      saleUuid: 'uuid2',
    });

    expect(makeOfferOrError.isRight()).toEqual(false);
  });

  it('can make a bid if amount is greater than minimal auction', async () => {
    const makeOfferOrError = await makeOfferUseCase.execute({
      userId: '1',
      offerType: 'auction',
      amount: 2200,
      saleUuid: 'uuid1',
    });

    expect(makeOfferOrError.isRight()).toEqual(true);
  });

  it('can NOT make a bid if amount is less than minimal auction', async () => {
    const makeOfferOrError = await makeOfferUseCase.execute({
      userId: '1',
      offerType: 'auction',
      amount: 0,
      saleUuid: 'uuid1',
    });

    expect(makeOfferOrError.isRight()).toEqual(false);
  });

  it('can NOT make a bid if auction is not accepted', async () => {
    const makeOfferOrError = await makeOfferUseCase.execute({
      userId: '1',
      offerType: 'auction',
      amount: 5000,
      saleUuid: 'uuid3',
    });

    expect(makeOfferOrError.isRight()).toEqual(false);
  });
});
