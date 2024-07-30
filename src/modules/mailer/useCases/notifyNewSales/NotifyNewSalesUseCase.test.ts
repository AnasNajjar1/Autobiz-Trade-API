import { NotifyNewSalesUseCase } from './NotifyNewSalesUseCase';
import { InMemoryMailerService } from '../../../../infra/mailer/InMemoryMailerService';
import { InMemoryApiUserService } from '../../../../infra/autobizApi/ApiUserService/InMemoryApiUserService';

let notifyNewSalesUseCase;
const mailer = new InMemoryMailerService();
const userApiService = new InMemoryApiUserService([
  {
    email: 'name@mail.com',
    id: 'FR_1',
    language: 'FR',
  },
]);

describe('Dipatch emails to a user when there is a new sale', () => {
  beforeEach(() => {
    notifyNewSalesUseCase = new NotifyNewSalesUseCase(mailer, userApiService);
  });

  it('Should send an email to the user with the list of vehicles', async () => {
    const spySendMail = jest.spyOn(mailer, 'sendMail');
    const notifyOrError = await notifyNewSalesUseCase.execute({
      userId: 'FR_1',
      sales: [
        {
          fileNumber: '111',
          brandLabel: 'renault',
          modelLabel: 'clio',
          versionLabel: 'active',
          mileage: 83723,
          pointofsaleName: 'malakof',
          uuid: 'peo-234',
        },
        {
          fileNumber: '111',
          brandLabel: 'peugeot',
          modelLabel: '308',
          versionLabel: 'active',
          mileage: 83723,
          pointofsaleName: 'malakof',
          uuid: 'eee-RTE',
        },
      ],
    });
    expect(notifyOrError.isRight()).toEqual(true);
    expect(spySendMail).toHaveBeenCalledWith(
      'name@mail.com',
      expect.stringContaining('autobizTrade'),
      expect.stringContaining('renault'),
    );
    expect(spySendMail).toHaveBeenCalledWith(
      'name@mail.com',
      expect.stringContaining('autobizTrade'),
      expect.stringContaining('eee-RTE'),
    );
  });
});
