import { BaseController } from '../../../../core/infra/BaseController';
import { ListIdMap } from '../../mappers/ListIdMap';
import { CreateListUseCase } from './CreateListUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';
import { CreateListErrors } from './CreateListErrors';

interface Request {
  name: string;
  picture: string;
  startDateTime: Date;
  endDateTime: Date;
  groupId: number;
}

export class CreateListController extends BaseController {
  private useCase: CreateListUseCase;

  constructor(useCase: CreateListUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: Request = request.body as Request;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const list = result.value.getValue();
        return this.created(ListIdMap.toDto(list));
      } else {
        const error = result.value;
        switch (error.constructor) {
          case CreateListErrors.ListAlreadyExistsError:
            return this.conflict(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
