import { BaseController } from '../../../../core/infra/BaseController';
import { GetModelsUseCase } from './GetModelsUseCase';
import { ModelMap } from '../../mappers/ModelMap';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { ModelDto } from '../../dtos/modelDto';

interface Response {
  limit: number;
  offset: number;
  rows: Array<ModelDto>;
  count: number;
}

export class GetModelsController extends BaseController {
  private useCase: GetModelsUseCase;

  constructor(useCase: GetModelsUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const filter = request.queryString?.filter;

    const dto = JSON.parse(filter).brandLabel;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        const models = result.value.getValue();

        return this.paginate<Response>(
          models.rows.map((p) => ModelMap.toDto(p)),
          {
            limit: models.limit,
            offset: models.offset,
            count: models.count,
          },
        );
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
