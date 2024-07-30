import { NotifyAuctionFinishedUseCase } from './NotifyAuctionFinishedUseCase';
import { InMemoryMailerService } from '../../../../infra/mailer/InMemoryMailerService';
import { EndOfSaleNotificationDto } from '../../../catalog/dtos/saleDto';
import { InMemoryApiUserService } from '../../../../infra/autobizApi/ApiUserService/InMemoryApiUserService';

let notifyAuctionFinishedUseCase;
const mailer = new InMemoryMailerService();
const userApiService = new InMemoryApiUserService([
  {
    email: 'user1@mail.com',
    id: 'FR_1',
    language: 'FR',
  },
  {
    email: 'user2@mail.com',
    id: 'FR_2',
    language: 'FR',
  },
  {
    email: 'user3@mail.com',
    id: 'FR_3',
    language: 'FR',
  },
]);

describe('Inform the involved users who about the end of a sale', () => {
  beforeEach(() => {
    notifyAuctionFinishedUseCase = new NotifyAuctionFinishedUseCase(
      mailer,
      userApiService,
    );
  });

  it('Should send an email to the winner of the sale', async () => {
    const spySendMail = jest.spyOn(mailer, 'sendMail');
    const notifyOrError = await notifyAuctionFinishedUseCase.execute(
      generateSale({
        uuid: 'uuid1',
        winner: 'FR_1',
        offers: [
          generateOffer('FR_1'),
          generateOffer('FR_2'),
          generateOffer('FR_2'),
          generateOffer('FR_3'),
        ],
      }),
    );
    expect(notifyOrError.isRight()).toEqual(true);
    expect(spySendMail).toHaveBeenCalledTimes(3);
    expect(spySendMail).toHaveBeenCalledWith(
      'user1@mail.com',
      expect.stringContaining('Félicitations'),
      expect.stringContaining('peugeot'),
    );
    expect(spySendMail).toHaveBeenCalledWith(
      'user2@mail.com',
      expect.stringContaining("Vous n'avez pas remporté"),
      expect.stringContaining('peugeot'),
    );
    expect(spySendMail).toHaveBeenCalledWith(
      'user3@mail.com',
      expect.stringContaining("Vous n'avez pas remporté"),
      expect.stringContaining('peugeot'),
    );
  });
});

interface Offer {
  userId: string;
  amount: number;
  offerType: string;
  saleId: number;
}

function generateOffer(userId: string): Offer {
  return {
    userId,
    amount: 2000,
    offerType: 'auction',
    saleId: 13,
  };
}

interface Params {
  uuid: string;
  winner?: string;
  offers?: Offer[];
}
function generateSale(params: Params): EndOfSaleNotificationDto {
  const { uuid, winner, offers } = params;

  return {
    uuid,
    fileNumber: 'ref',
    brandLabel: 'peugeot',
    modelLabel: '308',
    versionLabel: 'ACTIVE',
    mileage: 87000,
    city: 'malakof',
    paymentDeadline: 'test',
    pickupDeadline: 'test',
    comments: 'test',
    offers,
    winner,
    firstRegistrationDateYear: 2020,
    pdfReport: 'http://test.com',
  };
}
