import { BaseController } from '../../../../core/infra/BaseController';
import { CreatePartnerRequestUseCase } from './CreatePartnerRequestUseCase';
import { CreatePartnerRequestDto } from './CreatePartnerRequestDtos';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';


export class CreatePartnerRequestController extends BaseController {
  private useCase: CreatePartnerRequestUseCase;

  constructor(useCase: CreatePartnerRequestUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: CreatePartnerRequestDto = {
        comment: request.body?.comment,
        partnerId: request.body?.partnerId,
        vehicleId: request.body?.vehicleId,
        createdBy: request.user
      };

      const result = await this.useCase.execute(dto);
      if (result.isRight()) {
        return this.ok(result.value.getValue());
      } else {
        const error = result.value;
        switch (error.constructor) {
          default:
            return this.fail(result.value.errorValue().message);
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
