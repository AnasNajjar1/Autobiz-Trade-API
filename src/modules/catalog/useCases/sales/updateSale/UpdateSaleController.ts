import { BaseController } from '../../../../../core/infra/BaseController';
import { UpdateSaleUseCase } from './UpdateSaleUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { UpdateSaleRequestDto } from './UpdateSaleRequestDto';
import { SaleMap } from '../../../mappers/SaleMap';

export class UpdateSaleController extends BaseController {
  private useCase: UpdateSaleUseCase;

  constructor(useCase: UpdateSaleUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    try {
      const dto: UpdateSaleRequestDto = {
        id: request.path.id,
        validationStatus: request.body.validationStatus,
        supplyType: request.body.supplyType,
        acceptAuction: request.body.acceptAuction,
        acceptImmediatePurchase: request.body.acceptImmediatePurchase,
        acceptSubmission: request.body.acceptSubmission,
        auctionStartPrice: request.body.auctionStartPrice,
        auctionStepPrice: request.body.auctionStepPrice,
        auctionReservePrice: request.body.auctionReservePrice,
        immediatePurchasePrice: request.body.immediatePurchasePrice,
        startDateTime: request.body.startDateTime,
        endDateTime: request.body.endDateTime,
        comment: request.body.comment,
        assignedWinner: request.body.assignedWinner,
        assignedWinnerOffer: request.body.assignedWinnerOffer,
        winner: request.body.winner,
        vehicleId: request.body.vehicleId,
        ownerId: request.body.ownerId,
        groupId: request.body.groupId,
        listId: request.body.listId,
        updatedBy: request.user,
      };

      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const sale = result.value.getValue();

        return this.ok({ id: sale.id });
      } else {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(result.value.errorValue().message);
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
