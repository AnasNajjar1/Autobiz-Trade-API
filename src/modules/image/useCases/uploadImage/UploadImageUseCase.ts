import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { IImageService } from '../../../../infra/images/imageService';
import { UploadImageResponseDto } from './UploadImageDto';

type Response = Either<
  AppError.UnexpectedError,
  Result<UploadImageResponseDto>
>;
type Image = string;

interface Request {
  bucket: string;
  image: Image;
}
export class UploadImageUseCase implements UseCase<Request, Promise<Response>> {
  private imageService: IImageService;

  constructor(imageService: IImageService) {
    this.imageService = imageService;
  }

  public async execute(request: Request): Promise<Response> {
    const { bucket, image } = request;
    try {
      const path = await this.imageService.set(bucket, image);
      return right(Result.ok<UploadImageResponseDto>({ path }));
    } catch (err) {
      console.log(err);
      return left(new AppError.UnexpectedError(err));
    }
  }
}
