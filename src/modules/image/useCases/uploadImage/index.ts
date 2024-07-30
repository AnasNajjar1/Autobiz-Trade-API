import { UploadImageController } from './UploadImageController';
import { UploadImageUseCase } from './UploadImageUseCase';
import { imageService } from '../../../../infra/images';

const uploadImageUseCase = new UploadImageUseCase(imageService);
const uploadImageController = new UploadImageController(uploadImageUseCase);

const uploadImageHandler = (event) => {
  return uploadImageController.execute(event);
};

export { uploadImageUseCase, uploadImageController, uploadImageHandler };
