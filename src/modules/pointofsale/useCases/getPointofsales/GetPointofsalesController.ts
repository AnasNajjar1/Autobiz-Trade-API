import { LoggedController } from '../../../../core/infra/LoggedController';
import { GetPointofsalesUseCase } from './GetPointofsalesUseCase';
import { PointofsaleSimpleMap } from '../../mappers/PointofsaleSimpleMap';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { PointofsaleDto } from '../../dtos/pointofsaleDto';

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
  rows: Array<PointofsaleDto>;
  count: number;
}

export class GetPointofsalesController extends LoggedController {
  private useCase: GetPointofsalesUseCase;

  constructor(loggerService, useCase: GetPointofsalesUseCase) {
    super(loggerService);
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
        const pointofsales = result.value.getValue();

        return this.paginate<Response>(
          pointofsales.rows.map((p) => PointofsaleSimpleMap.toDto(p)),
          {
            limit: pointofsales.limit,
            offset: pointofsales.offset,
            count: pointofsales.count,
          },
        );
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
