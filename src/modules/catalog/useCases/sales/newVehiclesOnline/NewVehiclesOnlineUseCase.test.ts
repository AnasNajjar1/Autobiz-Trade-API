import { InMemorySaleRepo } from '../../../repos/implementations/inMemorySaleRepo';
import { InMemoryUserRepo } from '../../../../user/repos/implementations/inMemoryUserRepo';
import { NewVehiclesOnlineUseCase } from './NewVehiclesOnlineUseCase';
import { InMemoryMessenger } from '../../../../../infra/messenger/implementations/InMemoryMessenger';
import moment from 'moment';

const usersInMemory = [
  {
    id: 1,
    autobizUserId: 'FR_1',
    notificationDaily: true,
    inGroups: [
      {
        id: 1,
        name: 'Easy Reprise',
      },
      {
        id: 4,
        name: 'Pautric',
      },
    ],
  },
  {
    id: 2,
    autobizUserId: 'FR_2',
    notificationDaily: true,
    inGroups: [
      {
        id: 7,
        name: 'Porsche',
      },
    ],
  },
  {
    id: 3,
    autobizUserId: 'FR_3',
    notificationDaily: true,
    inGroups: [],
  },
  {
    id: 4,
    autobizUserId: 'FR_4',
    notificationDaily: false,
    inGroups: [
      {
        id: 1,
        name: 'Easy Reprise',
      },
      {
        id: 4,
        name: 'Pautric',
      },
    ],
  },
  {
    id: 5,
    autobizUserId: 'ES_1',
    notificationDaily: true,
    inGroups: [
      {
        id: 4,
        name: 'Pautric',
      },
    ],
  },
];

describe('New vehicule online cron useCase', () => {
  let newVehiclesOnlineUseCase;
  const messenger = new InMemoryMessenger({ execute: () => {} });
  const publishSpy = jest.spyOn(messenger, 'publishMessage');

  beforeAll(() => {
    newVehiclesOnlineUseCase = new NewVehiclesOnlineUseCase(
      new InMemorySaleRepo([
        generateSale('liveStock', {
          uuid: 'uuid1',
          groupId: 1,
          pointofsale: { name: 'malakof', country: 'fr' },
        }),
        generateSale('liveStock', {
          uuid: 'uuid2',
          groupId: null,
          pointofsale: { name: 'malakof', country: 'fr' },
        }),
        generateSale('closedStock', {
          uuid: 'uuid4',
          groupId: 1,
          pointofsale: { name: 'malakof', country: 'fr' },
        }),
        generateSale('livePrivate', {
          uuid: 'uuid5',
          groupId: 1,
          pointofsale: { name: 'malakof', country: 'fr' },
        }),
        generateSale('closedPrivate', {
          uuid: 'uuid6',
          groupId: 1,
          pointofsale: { name: 'malakof', country: 'fr' },
        }),
        generateSale('liveStock', {
          uuid: 'uuid7',
          groupId: 4,
          pointofsale: { name: 'test_spain', country: 'es' },
        }),
      ]),
      new InMemoryUserRepo(usersInMemory),
      messenger,
    );
  });

  test('should send new vehicle in stock with no group to all users with notificationDaily activated', async () => {
    const newVehicles = await newVehiclesOnlineUseCase.execute();
    expect(newVehicles.isRight()).toBe(true);
    expect(publishSpy).toHaveBeenNthCalledWith(
      1,
      'newVehicles',
      expect.objectContaining({
        userId: 'FR_1',
        sales: [
          expect.objectContaining({ uuid: 'uuid1' }),
          expect.objectContaining({ uuid: 'uuid2' }),
        ],
      }),
    );
    expect(publishSpy).toHaveBeenNthCalledWith(
      2,
      'newVehicles',
      expect.objectContaining({
        userId: 'FR_2',
        sales: [expect.objectContaining({ uuid: 'uuid2' })],
      }),
    );
    expect(publishSpy).toHaveBeenNthCalledWith(
      3,
      'newVehicles',
      expect.objectContaining({
        userId: 'FR_3',
        sales: [expect.objectContaining({ uuid: 'uuid2' })],
      }),
    );
    expect(publishSpy).toHaveBeenNthCalledWith(
      4,
      'newVehicles',
      expect.objectContaining({
        userId: 'ES_1',
        sales: [expect.objectContaining({ uuid: 'uuid7' })],
      }),
    );
    expect(publishSpy).toHaveBeenCalledTimes(4);
  });
});

function generateVehicle(
  fileNumber,
  brandLabel,
  modelLabel,
  versionLabel,
  mileage,
  pointofsale,
  carPictures,
) {
  return {
    fileNumber,
    brandLabel,
    modelLabel,
    versionLabel,
    mileage,
    pointofsale,
    carPictures,
  };
}

interface Params {
  uuid: string;
  groupId?: number;
  pointofsale: { name: string; country: string };
}
function generateSale(
  type: 'liveStock' | 'livePrivate' | 'closedStock' | 'closedPrivate',
  params: Params,
) {
  const { uuid, groupId, pointofsale } = params;

  let supplyType, status;
  switch (type) {
    case 'liveStock':
    case 'livePrivate':
      status = 'LIVE';
      break;
    default:
      status = 'CLOSED';
  }

  switch (type) {
    case 'liveStock':
    case 'closedStock':
      supplyType = 'STOCK';
      break;
    default:
      supplyType = 'OFFER_TO_PRIVATE';
  }

  return {
    id: Math.round(Math.random() * 100),
    uuid,
    validationStatus: 'VALIDATED',
    startDateTime: moment().subtract(3, 'day').toISOString(),
    endDateTime: moment().toISOString(),
    vehicleId: 10,
    supplyType,
    saleStats: { status },
    vehicle: generateVehicle(
      'ref',
      'peugeot',
      '308',
      'ACTIVE',
      87000,
      pointofsale,
      '{"three_quarters_front_picture":"https://test.jpg"}',
    ),
    groupId: groupId ? groupId : null,
  };
}
