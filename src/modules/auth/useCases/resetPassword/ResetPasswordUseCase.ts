import {
  left,
  Result,
  right,
} from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { ResetPasswordRequestDto } from './ResetPasswordRequestDto';
import { AppError } from '../../../../core/logic/AppError';
import { IApiUserService } from '../../../../infra/autobizApi/ApiUserService/IApiUserService';
import { ResetPasswordErrors } from './ResetPasswordErrors';
export class ResetPasswordUseCase
  implements UseCase<ResetPasswordRequestDto, Promise<any>> {
  private apiUserService: IApiUserService;

  constructor(apiUserService: IApiUserService) {
    this.apiUserService = apiUserService;
  }

  public async execute(request: ResetPasswordRequestDto): Promise<any> {
    try {
      const { username } = request;

      if (!username) {
        return left(new ResetPasswordErrors.UsernameRequired());
      }

      const resetPasswordOrError = await this.apiUserService.resetPassword(
        username,
      );

      if (resetPasswordOrError.isLeft()) {
        return left(new ResetPasswordErrors.CannotResetPassword(username));
      }

      return right(Result.ok(resetPasswordOrError));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
