import { LogoutUseCase } from './LogoutUseCase';
import { LogoutController } from './LogoutController';
import { loggerService } from '../../../../infra/logger';
import { apiUserService } from '../../../../infra/autobizApi/ApiUserService';

const logoutUseCase = new LogoutUseCase(apiUserService);
const logoutController = new LogoutController(loggerService, logoutUseCase);

const logoutHandler = (event) => {
  return logoutController.execute(event);
};

export { LogoutUseCase, LogoutController, logoutHandler };
