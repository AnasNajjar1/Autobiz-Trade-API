import { UseCaseError } from '../../../../../core/logic/UseCaseError';
import { Result } from '../../../../../core/logic/Result';

export namespace CompressionVehicleMainPhotoErrors {
  export class CompressionVehiclePictureErrors extends Result<UseCaseError> {
    constructor(id: number) {
      super(false, {
        message: `Couldn't find vehicle id ${id}`,
      } as UseCaseError);
    }
  }

  export class pictureThreeQuartersNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Can't found three quarter front picture.`,
      } as UseCaseError);
    }
  }
}
