import { Result, Either, right, left } from '../../../../core/logic/Result';
import { IImportRecordRepo } from '../../repos/importRecordRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class GetImportRecordDetailUseCase
  implements UseCase<number, Promise<Response>> {
  private importRecordRepo: IImportRecordRepo;

  constructor(importRecordRepo: IImportRecordRepo) {
    this.importRecordRepo = importRecordRepo;
  }

  public async execute(recordId: number): Promise<Response> {
    try {
      const record = await this.importRecordRepo.getRecordDetail(recordId);

      return right(Result.ok<any>(record));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
