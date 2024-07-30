import { Import } from '../../domain/import';
import { left, Result, Either, right } from '../../../../core/logic/Result';
import { AppError } from '../../../../core/logic/AppError';

export interface PaginatedImport {
  count: number;
  limit: number;
  offset: number;
  rows: Import[];
}
export type Response = Either<
  AppError.UnexpectedError,
  Result<PaginatedImport>
>;
