import { RegisterUseCase } from './RegisterUseCase';
import { RegisterController } from './RegisterController';
import { mailerService } from '../../../../infra/mailer';

const registerUseCase = new RegisterUseCase(mailerService);

const registerController = new RegisterController(registerUseCase);

const registerHandler = (event) => {
  return registerController.execute(event);
};

export { registerUseCase, registerController, registerHandler };
