import { LoginUseCase } from './LoginUseCase';
import { LoginController } from './LoginController';
import { messengerService } from '../../../../infra/messenger/index';
import { apiUserService } from '../../../../infra/autobizApi/ApiUserService';

const loginUseCase = new LoginUseCase(messengerService, apiUserService);
const loginController = new LoginController(loginUseCase);

const loginHandler = (event) => {
  return loginController.execute(event);
};

export { LoginUseCase, LoginController, loginHandler };
