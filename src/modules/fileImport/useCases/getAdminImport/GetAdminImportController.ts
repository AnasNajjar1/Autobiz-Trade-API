import { BaseController } from '../../../../core/infra/BaseController';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { GetAdminImportRequestDto } from './GetAdminImportRequestDto';
import { ImportMap } from '../../mappers/importMap';
import { GetAdminImportUseCase } from './GetAdminImportUseCase';

export class GetAdminImportController extends BaseController {
  private useCase: GetAdminImportUseCase;

  constructor(useCase: GetAdminImportUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: GetAdminImportRequestDto = {
        userId: request.user ? request.user : null,
        limit: request.q.limit,
        offset: request.q.offset,
        sortBy: request.q.sortBy,
        sortOrder: request.q.sortOrder,
        filter: request.q.filter,
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const vehicles = result.value.getValue();
        return this.paginate(
          vehicles.rows.map((p) => ImportMap.toAdminFullDto(p)),
          {
            limit: vehicles.limit,
            offset: vehicles.offset,
            count: vehicles.count,
          },
        );
      } else {
        switch (result.value.constructor) {
          default:
            return this.fail(result.value.errorValue().message);
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
