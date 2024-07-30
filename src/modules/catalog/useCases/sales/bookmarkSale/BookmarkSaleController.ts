import { LoggedController } from '../../../../../core/infra/LoggedController';
import { BookmarkSaleUseCase } from './BookmarkSaleUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { BookmarkSaleRequestDto } from './BookmarkSaleRequestDto';

export class BookmarkSaleController extends LoggedController {
  private useCase: BookmarkSaleUseCase;

  constructor(loggerService, useCase: BookmarkSaleUseCase) {
    super(loggerService);
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: BookmarkSaleRequestDto = {
      userId: request.user,
      uuid: request.path.uuid,
      toBookmark: request.body.favorite,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        return this.ok();
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
