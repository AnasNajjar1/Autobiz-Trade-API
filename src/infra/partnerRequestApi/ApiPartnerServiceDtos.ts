import { left, Result, Either, right } from '../../core/logic/Result';
import { AppError } from '../../core/logic/AppError';
import { ApiPartnerServiceErrors } from './ApiPartnerServiceErrors';

export type ApiErrorMessage =
  | AppError.UnexpectedError
  | ApiPartnerServiceErrors.ValidationFailed
  | ApiPartnerServiceErrors.PartnerRequestFailed
  | ApiPartnerServiceErrors.PartnerRequestInterruption;

export type ApiResponse<T> = Either<ApiErrorMessage, Result<T>>;
