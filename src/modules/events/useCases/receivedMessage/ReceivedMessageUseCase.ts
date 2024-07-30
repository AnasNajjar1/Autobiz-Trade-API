import { SendPartnerRequestUseCase } from './../../../partner/useCases/sendPartnerRequest/SendPartnerRequestUseCase';
import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { ReceivedMesssageErrors } from './ReceivedMesssageErrors';
import { Request } from './ReceivedMessageDto';
import { NotifyNewSalesUseCase } from '../../../mailer/useCases/notifyNewSales/NotifyNewSalesUseCase';
import { NotifyAuctionFinishedUseCase } from '../../../mailer/useCases/notifyAuctionFinished/NotifyAuctionFinishedUseCase';
import { LogCallUseCase } from '../../../usageLog/useCases/logCall/LogCallUseCase';
import { MaskRegistrationUseCase } from '../../../image/useCases/maskRegistration/MaskRegistrationUseCase';
import { AssignedWinnerNotificationUseCase } from '../../../mailer/useCases/assignedWinnerNotification/AssignedWinnerNotificationUseCase';
import { CompressingVehicleMainPhotoUseCase } from '../../../catalog/useCases/vehicles/compressingVehicleMainPhoto/CompressingVehicleMainPhotoUseCase';
import { VehicleSaleImportUseCase } from '../../../catalog/useCases/vehicleSaleImport/VehicleSaleImportUseCase';
import { VehicleImageImportUseCase } from '../../../catalog/useCases/vehicleImageImport/VehicleImageImportUseCase';

type Response = Either<ReceivedMesssageErrors.SubjectUnknownError, Result<any>>;
interface UseCases {
  notifyNewSalesUseCase: NotifyNewSalesUseCase;
  notifyAuctionFinishedUseCase: NotifyAuctionFinishedUseCase;
  maskRegistrationUseCase: MaskRegistrationUseCase;
  logCallUseCase: LogCallUseCase;
  assignedWinnerNotificationUseCase: AssignedWinnerNotificationUseCase;
  sendPartnerRequestUseCase: SendPartnerRequestUseCase;
  compressingVehicleMainPhotoUseCase: CompressingVehicleMainPhotoUseCase;
  vehicleSaleImportUseCase: VehicleSaleImportUseCase;
  vehicleImageImportUseCase: VehicleImageImportUseCase;
}

export class ReceivedMessageUseCase
  implements UseCase<Request, Promise<Response>>
{
  private notifyNewSalesUseCase: NotifyNewSalesUseCase;
  private notifyAuctionFinishedUseCase: NotifyAuctionFinishedUseCase;
  private maskRegistrationUseCase: MaskRegistrationUseCase;
  private logCallUseCase: LogCallUseCase;
  private assignedWinnerNotificationUseCase: AssignedWinnerNotificationUseCase;
  private sendPartnerRequestUseCase: SendPartnerRequestUseCase;
  private compressingVehicleMainPhotoUseCase: CompressingVehicleMainPhotoUseCase;
  private vehicleSaleImportUseCase: VehicleSaleImportUseCase;
  private vehicleImageImportUseCase: VehicleImageImportUseCase;

  constructor(useCases: UseCases) {
    this.notifyNewSalesUseCase = useCases.notifyNewSalesUseCase;
    this.notifyAuctionFinishedUseCase = useCases.notifyAuctionFinishedUseCase;
    this.maskRegistrationUseCase = useCases.maskRegistrationUseCase;
    this.logCallUseCase = useCases.logCallUseCase;
    this.assignedWinnerNotificationUseCase =
      useCases.assignedWinnerNotificationUseCase;
    this.sendPartnerRequestUseCase = useCases.sendPartnerRequestUseCase;
    this.compressingVehicleMainPhotoUseCase =
      useCases.compressingVehicleMainPhotoUseCase;
    this.vehicleSaleImportUseCase = useCases.vehicleSaleImportUseCase;
    this.vehicleImageImportUseCase = useCases.vehicleImageImportUseCase;
  }

  public async execute(request: Request): Promise<Response> {
    const { subject, data } = request;
    switch (subject) {
      case 'newVehicles':
        return await this.notifyNewSalesUseCase.execute(data);
      case 'endSaleNotification':
        return await this.notifyAuctionFinishedUseCase.execute(data);
      case 'maskRegistration':
        return await this.maskRegistrationUseCase.execute(data);
      case 'logCall':
        return await this.logCallUseCase.execute(data);
      case 'assignedWinnerNotification':
        return await this.assignedWinnerNotificationUseCase.execute(data);
      case 'sendPartnerRequest':
        return await this.sendPartnerRequestUseCase.execute(data);
      case 'compressMainPhoto':
        return await this.compressingVehicleMainPhotoUseCase.execute(data);
      case 'createSaleVehicle':
        return await this.vehicleSaleImportUseCase.execute(data);
      case 'uploadVehicleImage':
        return await this.vehicleImageImportUseCase.execute(data);
      default:
        return left(
          new ReceivedMesssageErrors.SubjectUnknownError(subject),
        ) as Response;
    }
  }
}
