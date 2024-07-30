import { left, Result, Either, right } from '../../../../core/logic/Result';
import { ILogRepo } from '../../repos/logRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { GetLogsListRequestDto } from './GetLogsListRequestDto';
import { Log } from '../../domain/log';

interface PaginatedLog {
  count: number;
  limit: number;
  offset: number;
  rows: Log[];
}

type Response = Either<AppError.UnexpectedError, Result<PaginatedLog>>;

export class GetLogsListUseCase
  implements UseCase<GetLogsListRequestDto, Promise<Response>> {
  private logRepo: ILogRepo;

  constructor(logRepo: ILogRepo) {
    this.logRepo = logRepo;
  }

  public async execute(request: GetLogsListRequestDto): Promise<Response> {
    try {
      const paginatedLogs = await this.logRepo.getLogs(request);

      return right(Result.ok<PaginatedLog>(paginatedLogs));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
