import { ReceivedMessageController } from './ReceivedMessageController';
import { ReceivedMessageUseCase } from './ReceivedMessageUseCase';
import { notifyNewSalesUseCase } from '../../../mailer/useCases/notifyNewSales/index';
import { notifyAuctionFinishedUseCase } from '../../../mailer/useCases/notifyAuctionFinished/index';
import { logCallUseCase } from '../../../usageLog/useCases/logCall';
import { assignedWinnerNotificationUseCase } from '../../../mailer/useCases/assignedWinnerNotification';
import { sendPartnerRequestUseCase } from '../../../partner/useCases/sendPartnerRequest';
import { messengerService } from '../../../../infra/messenger';
import { maskRegistrationUseCase } from '../../../image/useCases/maskRegistration/index';
import { compressingVehicleMainPhotoUseCase } from '../../../catalog/useCases/vehicles/compressingVehicleMainPhoto/index';
import { vehicleSaleImportUseCase } from '../../../catalog/useCases/vehicleSaleImport';
import { vehicleImageImportUseCase } from '../../../catalog/useCases/vehicleImageImport';

const receivedMessageUseCase = new ReceivedMessageUseCase({
  notifyNewSalesUseCase,
  notifyAuctionFinishedUseCase,
  maskRegistrationUseCase,
  logCallUseCase,
  assignedWinnerNotificationUseCase,
  sendPartnerRequestUseCase,
  compressingVehicleMainPhotoUseCase,
  vehicleSaleImportUseCase,
  vehicleImageImportUseCase,
});

const receivedMessageController = new ReceivedMessageController(
  messengerService,
  receivedMessageUseCase,
);

const receivedMessageHandler = (event) => {
  return receivedMessageController.execute(event);
};

export {
  receivedMessageUseCase,
  receivedMessageController,
  receivedMessageHandler,
};
