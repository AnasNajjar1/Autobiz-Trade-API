import { LoggedController } from '../../../../../core/infra/LoggedController';
import { GetAggregationsUseCase } from './GetAggregationsUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { GetAggregationsRequestDto } from './GetAggregationsRequestDto';

export class GetAggregationsController extends LoggedController {
  private useCase: GetAggregationsUseCase;

  constructor(loggerService, useCase: GetAggregationsUseCase) {
    super(loggerService);
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: GetAggregationsRequestDto = {
        userId: request.user ? request.user : null,
        filter: request.q.filter,
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        return this.ok(result.value.getValue(), {
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
