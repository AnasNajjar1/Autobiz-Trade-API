import { UseCaseError } from '../../../../core/logic/UseCaseError';
import { Result } from '../../../../core/logic/Result';

export namespace MaskRegistrationErrors {
  export class imageSourceNotFound extends Result<UseCaseError> {
    constructor(urlKey: string) {
      super(false, {
        message: `Can't get image ${urlKey} from S3`,
      } as UseCaseError);
    }
  }
  export class visionServiceNotAvailable extends Result<UseCaseError> {
    constructor(urlToHidePicture: string) {
      super(false, {
        message: `Vision encoutered an issue with the URL : ${urlToHidePicture}`,
      } as UseCaseError);
    }
  }
  export class ImageProcessingServiceEncouretedProblem extends Result<UseCaseError> {
    constructor(urlToHidePicture: string, platePositionXy: Object[]) {
      super(false, {
        message: `Pixelate to ${urlToHidePicture} is not possible with ${platePositionXy} positions`,
      } as UseCaseError);
    }
  }
  export class imageExportError extends Result<UseCaseError> {
    constructor(key: string, imageBuffer: Buffer) {
      super(false, {
        message: `Can't push picture ${imageBuffer} to  ${key} to S3`,
      } as UseCaseError);
    }
  }
}
