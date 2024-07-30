import { left, Result, Either, right } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { BookmarkPointofsaleRequestDto } from './BookmarkPointofsaleRequestDto';
import { IPointofsaleBookmarkRepo } from '../../repos/pointofsaleBookmarkRepo';

type Response = Either<AppError.UnexpectedError, Result<void>>;

export class BookmarkPointofsaleUseCase
  implements UseCase<BookmarkPointofsaleRequestDto, Promise<Response>> {
  private pointofsaleBookmarkRepo: IPointofsaleBookmarkRepo;

  constructor(pointofsaleBookmarkRepo: IPointofsaleBookmarkRepo) {
    this.pointofsaleBookmarkRepo = pointofsaleBookmarkRepo;
  }

  public async execute(
    request: BookmarkPointofsaleRequestDto,
  ): Promise<Response> {
    const { toBookmark, uuid, userId } = request;

    try {
      if (toBookmark) {
        await this.pointofsaleBookmarkRepo.add(uuid, userId);
      } else {
        await this.pointofsaleBookmarkRepo.remove(uuid, userId);
      }

      return right(Result.ok());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
