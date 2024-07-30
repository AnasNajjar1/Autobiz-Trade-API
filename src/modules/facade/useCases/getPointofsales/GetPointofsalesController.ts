import { BaseController } from '../../../../core/infra/BaseController';
import { GetPointofsalesUseCase } from './GetPointofsalesUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { GetPointofsalesRequestDto } from './GetPointofsalesRequestDto';

interface Response {
  limit: number;
  offset: number;
  rows: any;
  count: number;
}

export class GetPointofsalesController extends BaseController {
  private useCase: GetPointofsalesUseCase;

  constructor(useCase: GetPointofsalesUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const filter = JSON.parse(request.queryString.filter);
      const dto: GetPointofsalesRequestDto = {
        ids: filter.ids,
        id: filter.id,
        country: filter.country,
      };

      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        const pointofsales = result.value.getValue();

        return this.paginate<Response>(pointofsales.rows, {
          limit: pointofsales.limit,
          offset: pointofsales.offset,
          count: pointofsales.count,
        });
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
