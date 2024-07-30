import { BaseController } from '../../../../../core/infra/BaseController';
import { GetUserFiltersUseCase } from './GetUserFiltersUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { GetUserFiltersRequestDto } from './GetUserFiltersRequestDto';

export class GetUserFiltersController extends BaseController {
  private useCase: GetUserFiltersUseCase;

  constructor(useCase: GetUserFiltersUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: GetUserFiltersRequestDto = {
      userId: request.user ? request.user : null,
      filter: request.q?.filter,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const filters = result.value.getValue();

        return this.ok(filters, {
          'Cache-Control': 'max-age=300',
        });
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
