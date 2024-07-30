import { NotifyAuctionFinishedUseCase } from './NotifyAuctionFinishedUseCase';
import { mailerService } from '../../../../infra/mailer';
import { ApiUserService } from '../../../../infra/autobizApi/ApiUserService/ApiUserService';

const userService = new ApiUserService();

const notifyAuctionFinishedUseCase = new NotifyAuctionFinishedUseCase(
  mailerService,
  userService,
);

export { notifyAuctionFinishedUseCase };
