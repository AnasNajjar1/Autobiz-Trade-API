import { BookmarkPointofsaleUseCase } from './BookmarkPointofsaleUseCase';
import { BookmarkPointofsaleController } from './BookmarkPointofsaleController';
import { pointofsaleBookmarkRepo } from '../../repos';
import { loggerService } from '../../../../infra/logger';

const bookmarkPointofsaleUseCase = new BookmarkPointofsaleUseCase(
  pointofsaleBookmarkRepo,
);

const bookmarkPointofsaleController = new BookmarkPointofsaleController(
  loggerService,
  bookmarkPointofsaleUseCase,
);

const bookmarkPointofsaleHandler = (event) => {
  return bookmarkPointofsaleController.execute(event);
};

export {
  bookmarkPointofsaleUseCase,
  bookmarkPointofsaleController,
  bookmarkPointofsaleHandler,
};
