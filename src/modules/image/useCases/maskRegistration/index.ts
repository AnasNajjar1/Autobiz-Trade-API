import { MaskRegistrationUseCase } from './MaskRegistrationUseCase';
import { MaskRegistrationController } from './MaskRegistrationController';
import { messengerService } from '../../../../infra/messenger';
import { fileService } from '../../../../infra/fileService';
import { visionAPI } from '../../../../infra/vision';
import { imageProcessing } from '../../../../infra/imageProcessing';

const maskRegistrationUseCase = new MaskRegistrationUseCase(
  fileService,
  visionAPI,
  imageProcessing,
);

const maskRegistrationController = new MaskRegistrationController(
  maskRegistrationUseCase,
);

const maskRegistrationHandler = (event) => {
  return maskRegistrationController.execute(event);
};

export {
  maskRegistrationUseCase,
  maskRegistrationController,
  maskRegistrationHandler,
};
