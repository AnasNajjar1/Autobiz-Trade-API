import { left, right, Result, Either } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { RegisterDto } from './RegisterDto';
import { RegisterErrors } from './RegisterErrors';
import { IMailerService } from '../../../../infra/mailer/mailerService';
import { EmailsMap } from '../../../mailer/mappers/EmailsMap';
import Joi from 'joi';

type Response = Either<AppError.UnexpectedError | Result<any>, Result<number>>;

export class RegisterUseCase
  implements UseCase<RegisterDto, Promise<Response>> {
  private mailer: IMailerService;

  constructor(mailer: IMailerService) {
    this.mailer = mailer;
  }

  public async execute(dto: RegisterDto): Promise<Response> {
    const validation = this.validateData(dto);
    if (validation.isSuccess) {
      try {
        const to = process.env.emailRegister;
        const subject = EmailsMap.toSubjectRegister(dto.language);
        const content = EmailsMap.toContentRegister(dto);
        await this.mailer.sendMail(to, subject, content);
        return right(Result.ok<any>(true));
      } catch (err) {
        return left(new AppError.UnexpectedError(err));
      }
    } else {
      return left(
        new RegisterErrors.ValidationFailed(validation.error.toString()),
      );
    }
  }

  public validateData(data) {
    const validation = Joi.object({
      companyName: Joi.string().required(),
      vat: Joi.string().required(),
      companyNumber: Joi.string().required(),
      companyAddress: Joi.string().required(),
      companyAddressAddition: Joi.string().allow(null, ''),
      companyZip: Joi.string().required(),
      companyCity: Joi.string().required(),
      companyCountry: Joi.string().required(),
      civility: Joi.string().required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      role: Joi.string().required(),
      phoneNumber: Joi.string()
        .pattern(new RegExp(/^\+?\d{9,20}$/i))
        .required()
        .messages({
          'string.pattern.base': 'Phone Number must had at least 9 digits',
        }),
      email: Joi.string().email(),
      emailValidation: Joi.ref('email'),
      language: Joi.string().allow(null),
    }).validate(data);
    if (validation.error) {
      return Result.fail<any>(validation.error.message);
    }
    return Result.ok();
  }
}
