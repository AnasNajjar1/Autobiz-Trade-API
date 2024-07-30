import { left, Result, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { IImportRepo } from '../../repos/importRepo';
import { GetAdminImportRequestDto } from './GetAdminImportRequestDto';
import { PaginatedImport, Response } from './GetAdminImportResponseDto';

export class GetAdminImportUseCase
  implements UseCase<GetAdminImportRequestDto, Promise<Response>>
{
  private importRepo: IImportRepo;

  constructor(importRepo: IImportRepo) {
    this.importRepo = importRepo;
  }

  public async execute(request: GetAdminImportRequestDto): Promise<Response> {
    try {
      const PaginatedImport = await this.importRepo.getAdminImportList(request);
      return right(Result.ok<PaginatedImport>(PaginatedImport));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
