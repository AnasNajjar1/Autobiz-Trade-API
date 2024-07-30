import { CompressingVehicleMainPhotoUseCase } from './CompressingVehicleMainPhotoUseCase';
import { vehicleRepo } from '../../../repos';
import { imageProcessing } from '../../../../../infra/imageProcessing';
import { fileService } from '../../../../../infra/fileService';
import { messengerService } from '../../../../../infra/messenger';
const compressingVehicleMainPhotoUseCase =
  new CompressingVehicleMainPhotoUseCase(
    vehicleRepo,
    imageProcessing,
    fileService,
    messengerService,
  );
export { compressingVehicleMainPhotoUseCase };
