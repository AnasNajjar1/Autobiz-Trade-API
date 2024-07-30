import { BookmarkSaleUseCase } from './BookmarkSaleUseCase';
import { BookmarkSaleController } from './BookmarkSaleController';
import { saleBookmarkRepo } from '../../../repos';
import { loggerService } from '../../../../../infra/logger';

const bookmarkSaleUseCase = new BookmarkSaleUseCase(saleBookmarkRepo);

const bookmarkSaleController = new BookmarkSaleController(
  loggerService,
  bookmarkSaleUseCase,
);

const bookmarkSaleHandler = (event) => {
  return bookmarkSaleController.execute(event);
};

export { bookmarkSaleUseCase, bookmarkSaleController, bookmarkSaleHandler };
