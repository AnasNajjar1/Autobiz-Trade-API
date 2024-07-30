import { Result, Either, right, left } from '../../../../core/logic/Result';
import { IImportRecordRepo } from '../../repos/importRecordRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class GetImportRecordListUseCase
  implements UseCase<string, Promise<Response>> {
  private importRecordRepo: IImportRecordRepo;

  constructor(importRecordRepo: IImportRecordRepo) {
    this.importRecordRepo = importRecordRepo;
  }

  public async execute(filter?: any): Promise<Response> {
    if (!filter.creationDateMin) {
      filter.creationDateMin = new Date().toISOString().split('T')[0]; // Today YYYY-MM-DD
    }

    try {
      const records = await this.importRecordRepo.getRecordsList(filter);

      return right(Result.ok<any>(records));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
