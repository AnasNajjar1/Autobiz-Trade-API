import { BaseController } from '../../../../../core/infra/BaseController';
import { CreateSaleUseCase } from './CreateSaleUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { CreateSaleRequestDto } from './CreateSaleRequestDto';
import { CreateSaleErrors } from './CreateSaleErrors';

export class CreateSaleController extends BaseController {
  private useCase: CreateSaleUseCase;

  constructor(useCase: CreateSaleUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: CreateSaleRequestDto = {
        validationStatus: request.body.validationStatus,
        supplyType: request.body.supplyType,
        acceptAuction: Boolean(request.body.acceptAuction),
        acceptImmediatePurchase: Boolean(request.body.acceptImmediatePurchase),
        acceptSubmission: Boolean(request.body.acceptSubmission),
        auctionStartPrice: request.body.auctionStartPrice,
        auctionStepPrice: request.body.auctionStepPrice,
        auctionReservePrice: request.body.auctionReservePrice,
        immediatePurchasePrice: request.body.immediatePurchasePrice,
        startDateTime: request.body.startDateTime,
        endDateTime: request.body.endDateTime,
        comment: request.body.comment,
        vehicleId: request.body.vehicleId,
        ownerId: request.body.ownerId,
        groupId: request.body.groupId,
        listId: request.body.listId,
        expressSale: request.body.expressSale,
        createdBy: request.user,
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const newSaleId = result.value.getValue();

        return this.ok({ id: newSaleId });
      } else {
        const error = result.value;

        switch (error.constructor) {
          case CreateSaleErrors.ValidationFailed:
          case CreateSaleErrors.VehicleNotFound:
          case CreateSaleErrors.OwnerNotFound:
          case CreateSaleErrors.GroupNotFound:
          case CreateSaleErrors.VehicleHasAlreadyAValidatedSale:
            return this.fail(result.value.errorValue().message);
          default:
            return this.fail(result.value.errorValue());
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
