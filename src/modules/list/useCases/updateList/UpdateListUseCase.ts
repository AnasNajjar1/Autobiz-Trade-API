import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IListRepo } from '../../repos/listRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { List } from '../../domain/list';
import { UpdateListErrors } from './UpdateListErrors';
import { WithChanges, Changes } from '../../../../core/logic/WithChanges';
import { ListPicture } from '../../domain/listPicture';

type Response = Either<AppError.UnexpectedError | Result<any>, Result<List>>;

interface Request {
  id: number;
  name: string;
  picture: string;
  startDateTime: Date;
  endDateTime: Date;
  groupId: number;
}

export class UpdateListUseCase
  implements UseCase<Request, Promise<Response>>, WithChanges {
  private listRepo: IListRepo;
  public changes: Changes;

  constructor(listRepo: IListRepo) {
    this.listRepo = listRepo;
    this.changes = new Changes();
  }

  public async execute(request: any): Promise<Response> {
    let list: List;
    const listId = request.id;

    try {
      list = await this.listRepo.getListById(listId);
    } catch (err) {
      return left(new UpdateListErrors.ListNotFoundError(listId)) as Response;
    }

    if (request?.name !== undefined) {
      this.changes.addChange(list.updateName(request.name));
    }

    if (request?.picture !== undefined) {
      const pictureOrError: Result<ListPicture> = ListPicture.create(
        request.picture,
      );

      if (pictureOrError.isSuccess) {
        this.changes.addChange(list.updatePicture(pictureOrError.getValue()));
      } else {
        return left(pictureOrError);
      }
    }

    if (request?.startDateTime !== undefined) {
      this.changes.addChange(list.updateStartDateTime(request.startDateTime));
    }

    if (request?.endDateTime !== undefined) {
      this.changes.addChange(list.updateEndDateTime(request.endDateTime));
    }

    if (request?.groupId !== undefined) {
      this.changes.addChange(list.updateGroupId(request.groupId));
    }

    if (this.changes.getCombinedChangesResult().isSuccess) {
      try {
        await this.listRepo.save(list);

        return right(Result.ok<List>(list));
      } catch (err) {
        return left(new AppError.UnexpectedError(err)) as Response;
      }
    }
  }
}
