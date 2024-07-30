import { BaseController } from '../../../../core/infra/BaseController';
import { GetListsByUserUseCase } from './GetListsByUserUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { ListPublicDto } from '../../dtos/listDto';
import { ListMap } from '../../mappers/ListMap';
import { GetListsByUserRequestDto } from './GetListsByUserRequestDto';
import { GetListsByUserResponseDto } from './GetListsByUSerResponseDto';
import { List } from '../../domain/list';

export class GetListsByUserController extends BaseController {
  private useCase: GetListsByUserUseCase;

  constructor(useCase: GetListsByUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: GetListsByUserRequestDto = {
        userId: request.user,
      };

      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        const lists = result.value.getValue();

        return this.paginate(
          lists.rows.map((p) => ListMap.toPublicDto(p)),
          {
            limit: lists.limit,
            offset: lists.offset,
            count: lists.count,
          },
          {
            'Cache-Control': 'max-age=120',
          },
        );
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
