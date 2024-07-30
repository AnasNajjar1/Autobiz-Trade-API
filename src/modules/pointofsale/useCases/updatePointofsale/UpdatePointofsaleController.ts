import { BaseController } from '../../../../core/infra/BaseController';
import { PointofsaleIdMap } from '../../mappers/PointofsaleIdMap';
import { UpdatePointofsaleUseCase } from './UpdatePointofsaleUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';

interface Request {
  id: number;
  name: string;
  picture: string;
  startDateTime: Date;
  endDateTime: Date;
  groupId: number;
}

export class UpdatePointofsaleController extends BaseController {
  private useCase: UpdatePointofsaleUseCase;

  constructor(useCase: UpdatePointofsaleUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: Request = request.body as Request;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        return this.fail(result.value.errorValue().message);
      } else {
        const pointofsale = result;

        return this.updated(PointofsaleIdMap.toDto(pointofsale));
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
