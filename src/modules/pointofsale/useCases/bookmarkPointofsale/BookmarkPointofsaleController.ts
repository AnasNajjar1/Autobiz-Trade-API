import { LoggedController } from '../../../../core/infra/LoggedController';
import { BookmarkPointofsaleUseCase } from './BookmarkPointofsaleUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { BookmarkPointofsaleRequestDto } from './BookmarkPointofsaleRequestDto';

export class BookmarkPointofsaleController extends LoggedController {
  private useCase: BookmarkPointofsaleUseCase;

  constructor(loggerService, useCase: BookmarkPointofsaleUseCase) {
    super(loggerService);
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: BookmarkPointofsaleRequestDto = {
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
