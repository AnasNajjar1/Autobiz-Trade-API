import { AssignedWinnerNotificationUseCase } from './AssignedWinnerNotificationUseCase';
import { InMemoryMailerService } from '../../../../infra/mailer/InMemoryMailerService';
import { AssignedWinnerSaleNotificationDto } from '../../../catalog/dtos/saleDto';
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

describe('Inform the involved users who been assigned as winner of sale', () => {
  beforeEach(() => {
    notifyAuctionFinishedUseCase = new AssignedWinnerNotificationUseCase(
      mailer,
      userApiService,
    );
  });

  it('Should send an email to the assigned winner', async () => {
    const spySendMail = jest.spyOn(mailer, 'sendMail');
    const notifyOrError = await notifyAuctionFinishedUseCase.execute(
      generateSale({
        supplyType: 'STOCK',
        winner: 'FR_1',
      }),
    );
    expect(notifyOrError.isRight()).toEqual(true);
    expect(spySendMail).toHaveBeenCalledTimes(1);
    expect(spySendMail).toHaveBeenCalledWith(
      'user1@mail.com',
      expect.stringContaining('Félicitations'),
      expect.stringContaining('Peugeot'),
    );
  });
  interface Offer {
    id: number;
    userId: string;
    amount: number;
    offerType: string;
    saleId: number;
    createdAt: Date;
  }

  interface Params {
    supplyType: string;
    winner: string;
  }

  function generateOffer(id: number, userId: string): Offer {
    return {
      id,
      userId,
      amount: 2000,
      offerType: 'auction',
      saleId: 13,
      createdAt: new Date(),
    };
  }

  function generateSale(params: Params): AssignedWinnerSaleNotificationDto {
    const { supplyType, winner } = params;
    return {
      uuid: 'uuid1',
      brandLabel: 'Peugeot',
      modelLabel: '206',
      versionLabel: 'TDI 1.6',
      fileNumber: 'ref',
      mileage: 86000,
      offerAmount: 500,
      offerCreatedAt: new Date(),
      winner,
      supplyType,
      offers: [generateOffer(1, 'FR_1'), generateOffer(2, 'FR_2')],
    };
  }
});
