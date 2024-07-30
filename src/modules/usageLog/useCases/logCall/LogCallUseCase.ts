import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { LogCallRequestDto } from './LogCallRequestDto';
import { ISaveJsonService } from '../../../../infra/saveJson/SaveJsonService';

type Response = Either<AppError.UnexpectedError, Result<Boolean>>;

export class LogCallUseCase
  implements UseCase<LogCallRequestDto, Promise<Response>> {
  private saveJsonService: ISaveJsonService;

  constructor(saveJsonService: ISaveJsonService) {
    this.saveJsonService = saveJsonService;
  }

  public async execute(request: LogCallRequestDto): Promise<Response> {
    try {
      await this.saveJsonService.saveLog(request);

      return right(Result.ok<Boolean>(true));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
