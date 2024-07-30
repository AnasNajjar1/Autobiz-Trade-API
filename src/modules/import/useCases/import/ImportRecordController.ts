import { BaseController } from '../../../../core/infra/BaseController';
import { ImportRecordUseCase } from './ImportRecordUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { ImportRecordRequestDto } from './ImportRecordRequestDto';

export class ImportRecordController extends BaseController {
  private useCase: ImportRecordUseCase;

  constructor(useCase: ImportRecordUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: ImportRecordRequestDto = {
        id: request.path.id,
        auction: request.body?.auction,
        sale: request.body?.sale,
        salesComment: request.body?.salesComment,
        buyerId: request.body?.buyerId,
        country: request.body?.country,
        status: request.body?.status ? parseInt(request.body.status) : 4,
        offerType: request.body?.offerType,
        userId: request.user,
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const { id } = result.value.getValue();

        return this.ok({ id });
      } else {
        return this.fail(result.value.errorValue().message);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
