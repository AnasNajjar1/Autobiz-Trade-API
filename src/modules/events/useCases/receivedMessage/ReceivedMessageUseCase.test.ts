import { ReceivedMessageUseCase } from './ReceivedMessageUseCase';
import { NotifyNewSalesUseCase } from '../../../mailer/useCases/notifyNewSales/NotifyNewSalesUseCase';
import { NotifyAuctionFinishedUseCase } from '../../../mailer/useCases/notifyAuctionFinished/NotifyAuctionFinishedUseCase';
import { MaskRegistrationUseCase } from '../../../image/useCases/maskRegistration/MaskRegistrationUseCase';
import { InMemoryMailerService } from '../../../../infra/mailer/InMemoryMailerService';
import { InMemoryApiUserService } from '../../../../infra/autobizApi/ApiUserService/InMemoryApiUserService';
import { NotifyConnexionUseCase } from '../../../mailer/useCases/notifyConnexion/NotifyConnexionUseCase';
import { InMemoryMessenger } from '../../../../infra/messenger/implementations/InMemoryMessenger';
import { LogCallUseCase } from '../../../usageLog/useCases/logCall/LogCallUseCase';
import { InMemorySaveJsonService } from '../../../../infra/saveJson/implementations/InMemorySaveJsonService';

import { left, Result, Either, right } from '../../../../core/logic/Result';
import { InMemoryFileService } from '../../../../infra/fileService/implementations/InMemoryFileService';
import { InMemoryVisionAPI } from '../../../../infra/vision/InMemoryVisionAPI';
import { InMemoryImageProcessingService } from '../../../../infra/imageProcessing/InMemoryImageProcessing';
import { AssignedWinnerNotificationUseCase } from '../../../mailer/useCases/assignedWinnerNotification/AssignedWinnerNotificationUseCase';
import { apiUserService } from '../../../../infra/autobizApi/ApiUserService';
import { SendPartnerRequestUseCase } from '../../../partner/useCases/sendPartnerRequest/SendPartnerRequestUseCase';
import { InMemoryApiPartnerService } from '../../../../infra/partnerRequestApi/InMemoryApiPartnerService';
import { InMemoryPartnerRequestRepo } from '../../../partner/repos/implementations/inMemoryPartnerRequestRepo';
import { InMemoryVehicleRepo } from '../../../catalog/repos/implementations/inMemoryVehicleRepo';
import { CompressingVehicleMainPhotoUseCase } from '../../../catalog/useCases/vehicles/compressingVehicleMainPhoto/CompressingVehicleMainPhotoUseCase';
import { VehicleImageImportUseCase } from '../../../catalog/useCases/vehicleImageImport/VehicleImageImportUseCase';
import { InMemoryImportRepo } from '../../../fileImport/repos/implementations/inMemoryImportRepo';
import { VehicleSaleImportUseCase } from '../../../catalog/useCases/vehicleSaleImport/VehicleSaleImportUseCase';
import { InMemorySaleRepo } from '../../../catalog/repos/implementations/inMemorySaleRepo';
import { InMemoryGroupRepo } from '../../../group/repos/implementations/inMemoryGroupRepo';
import { InMemoryAwsTranslateService } from '../../../../infra/translate/InMemoryAwsTranslateService';
import { InMemoryApiReferentialService } from '../../../../infra/autobizApi/ApiReferentialService/InMemoryApiReferentialService';
import { InMemoryApiQuotationService } from '../../../../infra/autobizApi/ApiQuotationService/InMemoryApiQuotationService';
import { fakeGroupData } from '../../../catalog/assets/fakeGroupData';

let receivedMessageUseCase;
const mailer = new InMemoryMailerService();
const userService = new InMemoryApiUserService([]);
const messengerService = new InMemoryMessenger([]);
const jsonSaveService = new InMemorySaveJsonService();
const notifyNewSalesUseCase = new NotifyNewSalesUseCase(mailer, userService);
const notifyAuctionFinishedUseCase = new NotifyAuctionFinishedUseCase(
  mailer,
  userService,
);
const notifyConnexionUseCase = new NotifyConnexionUseCase(mailer, userService);
const fileService = new InMemoryFileService();
const visionService = new InMemoryVisionAPI([]);
const imageProcessingService = new InMemoryImageProcessingService();
const maskRegistrationUseCase = new MaskRegistrationUseCase(
  fileService,
  visionService,
  imageProcessingService,
);
const logCallUseCase = new LogCallUseCase(jsonSaveService);
const assignedWinnerNotificationUseCase = new AssignedWinnerNotificationUseCase(
  mailer,
  apiUserService,
);
const apiPartnerRequestService = new InMemoryApiPartnerService();
const partnerRequestRepo = new InMemoryPartnerRequestRepo([]);
const vehicleRepo = new InMemoryVehicleRepo([]);
const importRepo = new InMemoryImportRepo([]);
const sendPartnerRequestUseCase = new SendPartnerRequestUseCase(
  apiPartnerRequestService,
  partnerRequestRepo,
  vehicleRepo,
  apiUserService
);

const compressingVehicleMainPhotoUseCase =
  new CompressingVehicleMainPhotoUseCase(
    vehicleRepo,
    imageProcessingService,
    fileService,
    messengerService,
  );
const vehicleImageImportUseCase = new VehicleImageImportUseCase(
  importRepo,
  fileService,
  vehicleRepo,
  maskRegistrationUseCase,
  compressingVehicleMainPhotoUseCase,
);

const importRepot = new InMemoryImportRepo();
const saleRepo = new InMemorySaleRepo();
const groupRepo = new InMemoryGroupRepo(fakeGroupData);
const translateService = new InMemoryAwsTranslateService();
const apiReferentialService = new InMemoryApiReferentialService();
const apiQuotationService = new InMemoryApiQuotationService();
const vehicleSaleImportUseCase = new VehicleSaleImportUseCase(
  importRepot,
  fileService,
  apiReferentialService,
  vehicleRepo,
  saleRepo,
  groupRepo,
  translateService,
  apiQuotationService,
);

const data = { message: 'content' };

describe('Call the right use case when received a message', () => {
  beforeEach(() => {
    receivedMessageUseCase = new ReceivedMessageUseCase({
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
  });

  it('Fail if called with unexisting subject', async () => {
    const notifyOrError = await receivedMessageUseCase.execute({
      subject: 'unexisting subject',
      data,
    });
    expect(notifyOrError.isLeft()).toEqual(true);
  });

  test.each([
    ['newVehicles', notifyNewSalesUseCase],
    ['endSaleNotification', notifyAuctionFinishedUseCase],
    ['maskRegistration', maskRegistrationUseCase],
    ['logCall', logCallUseCase],
  ])(
    'When receive message %s, call the %s use case',
    async (subject, useCase) => {
      useCase.execute = jest
        .fn()
        .mockResolvedValue(right(Result.ok<any>(true)));
      const spyUseCaseExecute = spyOn(useCase, 'execute');
      const notifyOrError = await receivedMessageUseCase.execute({
        subject,
        data,
      });
      // expect(notifyOrError.isRight()).toEqual(true);
      expect(spyUseCaseExecute).toHaveBeenCalledWith(data);
    },
  );
});
