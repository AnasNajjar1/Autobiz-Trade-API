import { BaseController } from '../../../../core/infra/BaseController';
import { ListIdMap } from '../../mappers/ListIdMap';
import { UpdateListUseCase } from './UpdateListUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';

interface Request {
  id: number;
  name: string;
  picture: string;
  startDateTime: Date;
  endDateTime: Date;
  groupId: number;
}

export class UpdateListController extends BaseController {
  private useCase: UpdateListUseCase;

  constructor(useCase: UpdateListUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: Request = request.body as Request;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const list = result.value.getValue();
        return this.updated(ListIdMap.toDto(list));
      } else {
        return this.fail(result.value.errorValue().message);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
