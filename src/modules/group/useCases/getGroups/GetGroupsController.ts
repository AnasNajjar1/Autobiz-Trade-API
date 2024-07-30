import { BaseController } from '../../../../core/infra/BaseController';
import { GetGroupsUseCase } from './GetGroupsUseCase';
import { GroupMap } from '../../mappers/GroupMap';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { GroupDto } from '../../dtos/groupDto';

interface Request {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: string;
  filter?: {};
}

interface Response {
  limit: number;
  offset: number;
  rows: Array<GroupDto>;
  count: number;
}

export class GetGroupsController extends BaseController {
  private useCase: GetGroupsUseCase;

  constructor(useCase: GetGroupsUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: Request = request.q as Request;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        const groups = result.value.getValue();

        return this.paginate<Response>(
          groups.rows.map((p) => GroupMap.toDto(p)),
          {
            limit: groups.limit,
            offset: groups.offset,
            count: groups.count,
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
