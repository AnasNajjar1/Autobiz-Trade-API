import { AssignedWinnerNotificationUseCase } from './AssignedWinnerNotificationUseCase';
import { mailerService } from '../../../../infra/mailer';
import { ApiUserService } from '../../../../infra/autobizApi/ApiUserService/ApiUserService';
import { messengerService } from '../../../../infra/messenger';
const userService = new ApiUserService();

const assignedWinnerNotificationUseCase = new AssignedWinnerNotificationUseCase(
  mailerService,
  userService,
);

export { assignedWinnerNotificationUseCase };
