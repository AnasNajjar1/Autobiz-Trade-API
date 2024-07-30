import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IListRepo } from '../../repos/listRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import { List } from '../../domain/list';
import { CreateListErrors } from './CreateListErrors';
import { ListPicture } from '../../domain/listPicture';

type Response = Either<AppError.UnexpectedError | Result<any>, Result<List>>;

interface Request {
  name: string;
  picture: string;
  startDateTime: Date;
  endDateTime: Date;
  groupId: number;
}

export class CreateListUseCase implements UseCase<Request, Promise<Response>> {
  private listRepo: IListRepo;

  constructor(listRepo: IListRepo) {
    this.listRepo = listRepo;
  }

  public async execute(request: Request): Promise<Response> {
    const pictureOrError = ListPicture.create(request?.picture);

    const combinedPropsResult = Result.combine([pictureOrError]);

    if (combinedPropsResult.isFailure) {
      return left(combinedPropsResult);
    }

    const picture: ListPicture = pictureOrError.getValue();

    try {
      const list = await this.listRepo.getListByName(request.name);
      const listExists = !!list === true;
      if (listExists) {
        return left(
          new CreateListErrors.ListAlreadyExistsError(request.name),
        ) as Response;
      }
    } catch (error) {
      null;
    }

    try {
      const listOrError: Result<List> = List.create({
        name: request?.name,
        picture,
        startDateTime: request?.startDateTime,
        endDateTime: request?.endDateTime,
        groupId: request?.groupId,
      });
      if (listOrError.isFailure) {
        return left(listOrError);
      }

      const list: List = await this.listRepo.save(listOrError.getValue());

      return right(Result.ok<List>(list));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
