import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { BookmarkSaleRequestDto } from './BookmarkSaleRequestDto';
import { ISaleBookmarkRepo } from '../../../repos/saleBookmarkRepo';

type Response = Either<AppError.UnexpectedError, Result<void>>;

export class BookmarkSaleUseCase
  implements UseCase<BookmarkSaleRequestDto, Promise<Response>> {
  private saleBookmarkRepo: ISaleBookmarkRepo;

  constructor(saleBookmarkRepo: ISaleBookmarkRepo) {
    this.saleBookmarkRepo = saleBookmarkRepo;
  }

  public async execute(request: BookmarkSaleRequestDto): Promise<Response> {
    const { toBookmark, uuid, userId } = request;

    try {
      if (toBookmark) {
        await this.saleBookmarkRepo.add(uuid, userId);
      } else {
        await this.saleBookmarkRepo.remove(uuid, userId);
      }

      return right(Result.ok());
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
