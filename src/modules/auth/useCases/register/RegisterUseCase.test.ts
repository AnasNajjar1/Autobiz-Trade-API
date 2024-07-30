import { RegisterUseCase } from './RegisterUseCase';
import { InMemoryMailerService } from '../../../../infra/mailer/InMemoryMailerService';

const customerData = [
  [
    {
      companyName: 'Tincidunt Nibh Associates',
      vat: '877311977-00004',
      companyNumber: '0881486522',
      companyAddress: '1795 Proin Rd.',
      companyAddressAddition: '1795 Proin Rd.',
      companyZip: '29282',
      companyCity: 'Paranaguá',
      companyCountry: 'Tanzania',
      civility: 'mister',
      firstName: 'Hall',
      lastName: 'Marshall',
      role: 'accounter',
      phoneNumber: '+0881486521',
      email: 'Hall@test.fr',
      emailValidation: 'Hall@test.fr',
    },
    true,
  ],
  [
    {
      companyName: 'Tincidunt Nibh Associates',
      companyNumber: '0881486522',
      companyAddress: '1795 Proin Rd.',
      companyZip: '29282',
      companyCity: 'Paranaguá',
      companyCountry: 'Tanzania',
      civility: 'miss',
      firstName: 'Andria',
      lastName: 'Holand',
      role: 'manager',
      phoneNumber: '0881486521',
      email: 'Holand@test.fr',
      emailValidation: 'Andria@test.fr',
    },
    false,
  ],
];

describe('register use case', () => {
  test.each(customerData)(
    'sending subscription email demand depending on customer data',
    async (data, expected) => {
      const mailer = new InMemoryMailerService();
      const spySendMail = jest.spyOn(mailer, 'sendMail');
      const registerUseCase = new RegisterUseCase(mailer);
      const registerOrError = await registerUseCase.execute(data);
      expect(registerOrError.isRight()).toEqual(expected);
      expect(spySendMail).toHaveBeenCalledTimes(expected ? 1 : 0);
    },
  );
});
