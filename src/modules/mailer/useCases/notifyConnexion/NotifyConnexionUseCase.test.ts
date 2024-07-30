import { NotifyConnexionUseCase } from './NotifyConnexionUseCase';
import { InMemoryMailerService } from '../../../../infra/mailer/InMemoryMailerService';
import { InMemoryApiUserService } from '../../../../infra/autobizApi/ApiUserService/InMemoryApiUserService';

let notifyConnexionUseCase;
const mailer = new InMemoryMailerService();
const userApiService = new InMemoryApiUserService([
  {
    email: 'name@mail.com',
    id: 'FR_1',
    language: 'FR',
    firstname: 'Jean',
    lastname: 'Raglishter',
  },
]);

const destinationEmail = process.env.emailReplyTo;

describe('Dipatch emails to a user when there is a new sale', () => {
  beforeEach(() => {
    notifyConnexionUseCase = new NotifyConnexionUseCase(mailer, userApiService);
  });

  it('Should send an email when the user login', async () => {
    const spySendMail = jest.spyOn(mailer, 'sendMail');
    const notifyOrError = await notifyConnexionUseCase.execute({
      userId: 'FR_1',
    });
    expect(notifyOrError.isRight()).toEqual(true);
    expect(spySendMail).toHaveBeenNthCalledWith(
      1,
      destinationEmail,
      expect.stringContaining('Jean'),
      expect.stringContaining('Raglishter'),
    );
    expect(spySendMail).toBeCalledTimes(1);
  });
});
