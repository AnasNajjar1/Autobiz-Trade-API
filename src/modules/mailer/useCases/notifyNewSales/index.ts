import { NotifyNewSalesUseCase } from './NotifyNewSalesUseCase';
import { ApiUserService } from '../../../../infra/autobizApi/ApiUserService/ApiUserService';
import { mailerService } from '../../../../infra/mailer';

const userService = new ApiUserService();

const notifyNewSalesUseCase = new NotifyNewSalesUseCase(
  mailerService,
  userService,
);

export { notifyNewSalesUseCase };
