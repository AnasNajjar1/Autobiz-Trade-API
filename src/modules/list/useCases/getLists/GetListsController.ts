import { BaseController } from '../../../../core/infra/BaseController';
import { GetListsUseCase } from './GetListsUseCase';
import { ListMap } from '../../mappers/ListMap';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { ListAdminDto } from '../../dtos/listDto';

interface Request {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: string;
  filter?: {};
}

export class GetListsController extends BaseController {
  private useCase: GetListsUseCase;

  constructor(useCase: GetListsUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: Request = request.q as Request;
    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const lists = result.value.getValue();

        return this.paginate(
          lists.rows.map((p) => ListMap.toAdminDto(p)),
          {
            limit: lists.limit,
            offset: lists.offset,
            count: lists.count,
          },
          {
            'Cache-Control': 'max-age=120',
          }
        );
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
