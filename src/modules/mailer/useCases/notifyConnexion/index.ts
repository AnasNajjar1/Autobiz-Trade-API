import { NotifyConnexionUseCase } from './NotifyConnexionUseCase';
import { ApiUserService } from '../../../../infra/autobizApi/ApiUserService/ApiUserService';
import { mailerService } from '../../../../infra/mailer';

const userService = new ApiUserService();

const notifyConnexionUseCase = new NotifyConnexionUseCase(
  mailerService,
  userService,
);

export { notifyConnexionUseCase };
