import { BaseController } from '../../../../core/infra/BaseController';
import { GetImportRecordListUseCase } from './GetImportRecordListUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';

export class GetImportRecordListController extends BaseController {
  private useCase: GetImportRecordListUseCase;

  constructor(useCase: GetImportRecordListUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const filter = request.queryString?.filter
      ? JSON.parse(request.queryString.filter)
      : {};

    try {
      const result = await this.useCase.execute(filter);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        const recordList = result.value.getValue();

        return this.paginate<Response>(recordList.rows, {
          limit: recordList.count,
          offset: 0,
          count: recordList.count,
        });
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
