import { BaseController } from '../../../../core/infra/BaseController';
import { RegisterUseCase } from './RegisterUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { RegisterDto } from './RegisterDto';
import { RegisterErrors } from './RegisterErrors';

export class RegisterController extends BaseController {
  private useCase: RegisterUseCase;

  constructor(useCase: RegisterUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const {
        companyName,
        vat,
        companyNumber,
        companyAddress,
        companyAddressAddition,
        companyZip,
        companyCity,
        companyCountry,
        civility,
        firstName,
        lastName,
        role,
        phoneNumber,
        email,
        emailValidation,
      } = request.body;
      const dto: RegisterDto = {
        companyName,
        vat,
        companyNumber,
        companyAddress,
        companyAddressAddition,
        companyZip,
        companyCity,
        companyCountry,
        civility,
        firstName,
        lastName,
        role,
        phoneNumber,
        email,
        emailValidation,
        language:
          request.path?.language || request.queryString?.language || 'fr',
      };

      const result = await this.useCase.execute(dto);
      if (result.isRight()) {
        return this.ok('Register succeeded');
      } else {
        const error = result.value;
        switch (error.constructor) {
          case RegisterErrors.ValidationFailed:
            return this.fail(result.value.errorValue().message);
          default:
            return this.fail(result.value.errorValue());
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
