import { InMemorySaleRepo } from '../../../repos/implementations/inMemorySaleRepo';
import { EndSaleNotificationUseCase } from './EndSaleNotificationUseCase';
import { InMemoryMessenger } from '../../../../../infra/messenger/implementations/InMemoryMessenger';
import moment from 'moment';

const cronFrequency = 2;

const fakeOffer = {
  userId: 'FR_1',
  amount: 2000,
  offerType: 'auction',
  saleId: 13,
};

describe('New vehicule online cron useCase', () => {
  let endSaleNotificationUseCase;
  const messenger = new InMemoryMessenger({ execute: () => {} });
  const publishSpy = jest.spyOn(messenger, 'publishMessage');

  beforeAll(() => {
    endSaleNotificationUseCase = new EndSaleNotificationUseCase(
      new InMemorySaleRepo([
        generateSale('justEnded', 'VALIDATED', {
          uuid: 'uuid1',
          winner: 'FR_1',
          assignedWinner: null,
          saleoffers: [fakeOffer, fakeOffer],
        }),
        generateSale('justEnded', 'DRAFT', {
          uuid: 'uuid2',
          winner: 'FR_1',
          assignedWinner: null,
          saleoffers: [fakeOffer, fakeOffer],
        }),
        generateSale('old', 'VALIDATED', {
          uuid: 'uuid3',
          winner: 'FR_1',
          assignedWinner: null,
          saleoffers: [fakeOffer, fakeOffer],
        }),
        generateSale('justEnded', 'CANCELED', {
          uuid: 'uuid4',
          winner: 'FR_33',
          assignedWinner: null,
          saleoffers: [fakeOffer, fakeOffer],
        }),
        generateSale('justEnded', 'VALIDATED', {
          uuid: 'uuid5',
          winner: null,
          assignedWinner: null,
          saleoffers: [],
        }),
        generateSale('justEnded', 'VALIDATED', {
          uuid: 'uuid6',
          winner: null,
          assignedWinner: null,
          saleoffers: [fakeOffer, fakeOffer],
        }),
        generateSale('justEnded', 'VALIDATED', {
          uuid: 'uuid7',
          winner: 'FR_33',
          assignedWinner: null,
          saleoffers: [fakeOffer, fakeOffer],
        }),
        generateSale('justEnded', 'VALIDATED', {
          uuid: 'uuid8',
          winner: 'FR_33',
          assignedWinner: 'FR_33',
          saleoffers: [fakeOffer, fakeOffer],
        }),
      ]),
      messenger,
    );
  });

  test('should send new vehicle in stock with no group to all users with notificationDaily activated', async () => {
    const endSales = await endSaleNotificationUseCase.execute(cronFrequency);
    expect(endSales.isRight()).toBe(true);
    expect(publishSpy).toBeCalledTimes(2);
    expect(publishSpy).toHaveBeenNthCalledWith(
      1,
      'endSaleNotification',
      expect.objectContaining({
        uuid: 'uuid1',
        winner: 'FR_1',
        city: 'malakof',
        brandLabel: 'peugeot',
      }),
    );
    expect(publishSpy).toHaveBeenNthCalledWith(
      2,
      'endSaleNotification',
      expect.objectContaining({ uuid: 'uuid7', winner: 'FR_33' }),
    );
  });
});

function generateVehicle(
  fileNumber,
  brandLabel,
  modelLabel,
  versionLabel,
  mileage,
  pointofsaleName,
) {
  return {
    fileNumber,
    brandLabel,
    modelLabel,
    versionLabel,
    mileage,
    pointofsale: { name: pointofsaleName, city: pointofsaleName },
  };
}

interface Offer {
  userId: string;
  amount: number;
  offerType: string;
}

interface Params {
  uuid: string;
  winner?: string;
  assignedWinner?: string;
  saleoffers?: Offer[];
}
function generateSale(
  type: 'justEnded' | 'old',
  validationStatus: 'VALIDATED' | 'DRAFT' | 'CANCELED',
  params: Params,
) {
  const { uuid, winner, saleoffers, assignedWinner } = params;

  let endDateTime;
  const startDateTime = moment().subtract(12, 'hours');
  switch (type) {
    case 'justEnded':
      endDateTime = moment()
        .subtract(cronFrequency, 'minutes')
        .add(10, 'seconds');
      break;
    default:
      endDateTime = moment()
        .subtract(cronFrequency, 'minutes')
        .subtract(60, 'seconds');
  }

  return {
    id: Math.round(Math.random() * 100),
    uuid,
    validationStatus,
    startDateTime: startDateTime.toISOString(),
    endDateTime: endDateTime.toISOString(),
    vehicleId: 10,
    supplyType: 'STOCK',
    salesStat: {
      status: 'LIVE',
    },
    vehicle: generateVehicle(
      'ref',
      'peugeot',
      '308',
      'ACTIVE',
      87000,
      'malakof',
    ),
    groupId: null,
    saleoffers,
    winner,
    assignedWinner,
  };
}
