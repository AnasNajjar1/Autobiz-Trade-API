import { BaseController } from '../../../../core/infra/BaseController';
import { PointofsaleIdMap } from '../../mappers/PointofsaleIdMap';
import { CreatePointofsaleUseCase } from './CreatePointofsaleUseCase';
import { HttpRequestDto } from '../../../../infra/http/HttpRequest';

interface Request {
  action: string;
  autobizPosId: string;
  city: string;
  country: string;
  comments: string;
  documentation: any;
  info: string;
  latitude: number;
  longitude: number;
  name: string;
  paymentDeadline: string;
  pickupDeadline: string;
  picture: string;
  zipCode: string;
}

export class CreatePointofsaleController extends BaseController {
  private useCase: CreatePointofsaleUseCase;

  constructor(useCase: CreatePointofsaleUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const dto: Request = request.body as Request;
    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const pointofsale = result.value.getValue();
        return this.created(PointofsaleIdMap.toDto(pointofsale));
      } else {
        const error = result.value;
        switch (error.constructor) {
          default:
            return this.fail(error.errorValue().message);
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
