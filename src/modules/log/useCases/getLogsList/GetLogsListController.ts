import { BaseController } from '../../../../core/infra/BaseController';
import { GetLogsListUseCase } from './GetLogsListUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { GetLogsListRequestDto } from './GetLogsListRequestDto';
import { LogMap } from '../../mappers/LogMap';

export class GetLogsListController extends BaseController {
  private useCase: GetLogsListUseCase;

  constructor(useCase: GetLogsListUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const filter = {
      referenceId: request.q?.filter?.referenceId,
      referenceTable: request.q?.filter?.referenceTable,
      action: request.q?.filter?.action,
    };

    try {
      const dto: GetLogsListRequestDto = {
        limit: Number(request.q?.limit),
        offset: Number(request.q?.offset),
        sortBy: request.q?.sortBy,
        sortOrder: request.q?.sortOrder,
        filter,
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const partners = result.value.getValue();

        return this.paginate(
          partners.rows.map((p) => LogMap.toDto(p)),
          {
            limit: partners.limit,
            offset: partners.offset,
            count: partners.count,
          },
        );
      } else {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(error.errorValue().message);
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
