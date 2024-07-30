import { AppError } from '../../../core/logic/AppError';
import { Either, Result } from '../../../core/logic/Result';

export type ApiErrorMessage = AppError.UnexpectedError;

export type ApiResponse<T> = Either<ApiErrorMessage, Result<T>>;

export interface IApiGoogleRecaptchaService {
  verify(userId: string): Promise<ApiResponse<boolean>>;
}
