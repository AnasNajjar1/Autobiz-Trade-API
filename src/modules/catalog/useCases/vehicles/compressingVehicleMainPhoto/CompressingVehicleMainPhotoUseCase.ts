import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { IVehicleRepo } from '../../../repos/vehicleRepo';
import { CompressionVehicleMainPhotoRequestDto } from './CompressionVehicleMainPhotoRequestDto';
import { CompressionVehicleMainPhotoErrors } from './CompressionVehicleMainPhotoErrors';
import { IImageProcessingService } from '../../../../../infra/imageProcessing/ImageProcessingService';
import { IFileService } from '../../../../../infra/fileService/FileService';
import { IMessengerService } from '../../../../../infra/messenger/MessengerService';
type Response = Either<AppError.UnexpectedError, Result<Boolean>>;

export class CompressingVehicleMainPhotoUseCase
  implements UseCase<CompressionVehicleMainPhotoRequestDto, Promise<Response>>
{
  private vehicleRepo: IVehicleRepo;
  private imageService: IImageProcessingService;
  public fileService: IFileService;
  public messengerService: IMessengerService;

  constructor(
    vehicleRepo: IVehicleRepo,
    imageService: IImageProcessingService,
    fileService: IFileService,
    messengerService: IMessengerService,
  ) {
    this.vehicleRepo = vehicleRepo;
    this.imageService = imageService;
    this.fileService = fileService;
    this.messengerService = messengerService;
  }

  public async execute(
    request: CompressionVehicleMainPhotoRequestDto,
  ): Promise<Response> {
    try {
      const vehicle = await this.vehicleRepo.getAdminVehicleById(request.id);

      const { three_quarters_front_picture } = vehicle.carPicturesMain;

      const urlPicturesMain = three_quarters_front_picture;

      if (!urlPicturesMain) {
        return left(
          new CompressionVehicleMainPhotoErrors.pictureThreeQuartersNotFound(),
        );
      }
      const imageCompress = await this.imageService.compressPicture(
        urlPicturesMain,
      );
      const url = await this.fileService.setImageCompress(
        urlPicturesMain,
        imageCompress,
      );
      if (url) {
        vehicle.updateThumbnail(url);
        await this.vehicleRepo.save(vehicle);
        await this.messengerService.publishMessage('maskRegistration', { url });
      }

      return right(Result.ok<Boolean>(true));
    } catch (err) {
      return left(
        new CompressionVehicleMainPhotoErrors.CompressionVehiclePictureErrors(
          request.id,
        ),
      );
    }
  }
}
