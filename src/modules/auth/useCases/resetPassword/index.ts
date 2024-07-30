import { ResetPasswordUseCase } from './ResetPasswordUseCase';
import { ResetPasswordController } from './ResetPasswordController';
import { ApiUserService } from '../../../../infra/autobizApi/ApiUserService/ApiUserService';

const userService = new ApiUserService();

const resetPasswordUseCase = new ResetPasswordUseCase(userService);

const resetPasswordController  = new ResetPasswordController(resetPasswordUseCase);

const resetPasswordHandler = (event) => {
  return resetPasswordController.execute(event);
};

export { resetPasswordUseCase, resetPasswordController, resetPasswordHandler };