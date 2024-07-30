import { InMemoryMailerService } from '../../../infra/mailer/InMemoryMailerService';
import { Offer } from '../domain/offer';
import { InMemorySaleRepo } from '../repos/implementations/inMemorySaleRepo';
import { IOfferRepo } from '../repos/offerRepo';
import { ISaleRepo } from '../repos/saleRepo';
import { offerCreatedEvent } from './offerCreatedEvent';

let saleRepo: ISaleRepo;
let mailerService: InMemoryMailerService;

const mockUserInfoFunction = () => {
  return {
    email: 'foobar@test.fr',
    country: 'fr',
  };
};

describe('OfferCreated Event', () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  beforeAll(() => {
    mailerService = new InMemoryMailerService();
    saleRepo = new InMemorySaleRepo([
      {
        id: 1,
        uuid: 'uuid1',
        validationStatus: 'VALIDATED',
        acceptAuction: true,
        acceptSubmission: true,
        acceptImmediatePurchase: true,
        auctionStartPrice: 1000,
        auctionStepPrice: 500,
        bestOfferer: 'joe',
        immediatePurchasePrice: 5000,
        supplyType: 'STOCK',
        startDateTime: today,
        endDateTime: tomorrow,
        vehicleId: 1,
        vehicle: {
          brandLabel: 'Peugeot',
          pointofsale: {
            id: 1,
            name: 'postest',
            city: 'paris',
          },
        },

        countAuctions: 1,
      },
      {
        id: 2,
        uuid: 'uuid1',
        validationStatus: 'VALIDATED',
        user: { autobizUserId: 'owner' },
        acceptAuction: false,
        acceptSubmission: true,
        acceptImmediatePurchase: false,
        supplyType: 'OFFER_TO_PRIVATE',
        startDateTime: today,
        endDateTime: tomorrow,
        vehicleId: 1,
        vehicle: {
          brandLabel: 'Peugeot',
          pointofsale: {
            id: 1,
            name: 'postest',
            city: 'paris',
          },
        },
      },
    ]);
  });

  it('not send email when offerer is already best offerer (case auction)', async () => {
    const sale = await saleRepo.getSaleById(1);

    const offer: Offer = new Offer({
      userId: 'joe',
      amount: 1200,
      offerType: 'auction',
      saleId: 1,
    });

    sale.addOffer(offer);

    const email = await offerCreatedEvent(
      offer,
      sale,
      mailerService,
      mockUserInfoFunction,
    );

    expect(email).toBe(undefined);
  });

  it('send email to last best offerer when he looses winnership (case auction)', async () => {
    const sale = await saleRepo.getSaleById(1);

    const offer: Offer = new Offer({
      userId: 'kim',
      amount: 1200,
      offerType: 'auction',
      saleId: 1,
    });

    sale.addOffer(offer);

    const email = await offerCreatedEvent(
      offer,
      sale,
      mailerService,
      mockUserInfoFunction,
    );

    expect(email.Destination.ToAddresses[0]).toBe(mockUserInfoFunction().email);
  });

  it('send email to owner  (case submission / Offer to Private sale)', async () => {
    const sale = await saleRepo.getSaleById(2);

    const offer: Offer = new Offer({
      userId: 'joe',
      amount: 200,
      offerType: 'submissiom',
      saleId: 2,
    });

    sale.addOffer(offer);

    const email = await offerCreatedEvent(
      offer,
      sale,
      mailerService,
      mockUserInfoFunction,
    );

    expect(email.Destination.ToAddresses[0]).toBe(mockUserInfoFunction().email);
  });
});
