import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { IImageProcessingService } from '../../../../infra/imageProcessing/ImageProcessingService';
import { IVisionService } from '../../../../infra/vision/VisionAPIService';
import { IFileService } from '../../../../infra/fileService/FileService';
import { MaskRegistrationRequestDto } from './MaskRegistrationRequestDto';
import { MaskRegistrationErrors } from './MaskRegistrationErrors';

type Response = Either<
  | AppError.UnexpectedError
  | MaskRegistrationErrors.imageSourceNotFound
  | MaskRegistrationErrors.visionServiceNotAvailable
  | MaskRegistrationErrors.ImageProcessingServiceEncouretedProblem
  | MaskRegistrationErrors.imageExportError,
  Result<string>
>;

export class MaskRegistrationUseCase
  implements UseCase<MaskRegistrationRequestDto, Promise<Response>> {
  public fileService: IFileService;
  public visionService: IVisionService;
  public imageService: IImageProcessingService;

  constructor(
    fileService: IFileService,
    visionservice: IVisionService,
    imageService: IImageProcessingService,
  ) {
    (this.fileService = fileService),
      (this.visionService = visionservice),
      (this.imageService = imageService);
  }

  public async execute(request: MaskRegistrationRequestDto): Promise<Response> {
    const { url } = request;

    let imageURL, registrationLocations, imageBuffer;

    // try {
    //   imageURL = await this.fileService.getImage(urlKey); //must return URL
    // } catch (err) {
    //   throw err
    //   return left(new MaskRegistrationErrors.imageSourceNotFound(request.urlKey));
    // }
    try {
      registrationLocations = await this.visionService.getPlatelocation(url);
    } catch (err) {
      return left(new MaskRegistrationErrors.visionServiceNotAvailable(url));
    }
    try {
      imageBuffer = await this.imageService.exportPicturePlate(
        url,
        registrationLocations,
      );
    } catch (err) {
      console.log(err);
      return left(
        new MaskRegistrationErrors.ImageProcessingServiceEncouretedProblem(
          url,
          registrationLocations,
        ),
      );
    }

    try {
      await this.fileService.setImage(url, imageBuffer);
      return right(Result.ok<string>(imageURL));
    } catch (err) {
      return left(
        new MaskRegistrationErrors.imageExportError(url, imageBuffer),
      );
    }

    //
  }
}
