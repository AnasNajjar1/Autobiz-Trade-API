import { BaseController } from '../../../../core/infra/BaseController';
import { GetUsersUseCase } from './GetUsersUseCase';
import { UserMap } from '../../mappers/UserMap';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { UserDto } from '../../dtos/userDto';

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
  rows: Array<UserDto>;
  count: number;
}

export class GetUsersController extends BaseController {
  private useCase: GetUsersUseCase;

  constructor(useCase: GetUsersUseCase) {
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
        const users = result.value.getValue();

        return this.paginate<Response>(
          users.rows.map((p) => UserMap.toDto(p)),
          {
            limit: users.limit,
            offset: users.offset,
            count: users.count,
          },
        );
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
