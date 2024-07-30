import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { ISaleRepo } from '../../../repos/saleRepo';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Sale } from '../../../domain/sale';
import { UpdateSaleRequestDto } from './UpdateSaleRequestDto';
import { UpdateSaleErrors } from './UpdateSaleErrors';
import { WithChanges, Changes } from '../../../../../core/logic/WithChanges';
import { SaleService } from '../../../domain/services/saleService';
import { IMessengerService } from '../../../../../infra/messenger/MessengerService';
import { SaleMap } from '../../../mappers/SaleMap';
import { ITranslateService } from '../../../../../infra/translate/translateService';

type Response = Either<
  | AppError.UnexpectedError
  | UpdateSaleErrors.SaleNotFoundError
  | UpdateSaleErrors.WrongValidationStatus
  | UpdateSaleErrors.ValidationFailed
  | UpdateSaleErrors.VehicleHasAlreadyAValidatedSale
  | Result<any>,
  Result<Sale>
>;

export class UpdateSaleUseCase
  implements UseCase<UpdateSaleRequestDto, Promise<Response>>, WithChanges {
  private saleRepo: ISaleRepo;
  private saleService: SaleService;
  public changes: Changes;
  private messenger: IMessengerService;
  private translateService: ITranslateService;

  constructor(
    saleRepo: ISaleRepo,
    messenger: IMessengerService,
    saleService?: SaleService,
    translateService?: ITranslateService,
  ) {
    this.saleRepo = saleRepo;
    this.saleService = saleService;
    this.changes = new Changes();
    this.messenger = messenger;
    this.translateService = translateService;
  }

  public async execute(dto: UpdateSaleRequestDto): Promise<Response> {
    let sale: Sale;

    try {
      sale = await this.saleRepo.getSaleById(dto.id);
    } catch (err) {
      console.warn(err);
      return left(new UpdateSaleErrors.SaleNotFoundError(dto.id)) as Response;
    }

    if (dto?.validationStatus !== undefined) {
      const oldStatus = sale.validationStatus;
      const newStatus = dto.validationStatus;

      if (
        (oldStatus === 'VALIDATED' && newStatus === 'DRAFT') ||
        (oldStatus === 'CANCELED' && newStatus === 'DRAFT') ||
        (oldStatus === 'CANCELED' && newStatus === 'VALIDATED')
      ) {
        return left(
          new UpdateSaleErrors.WrongValidationStatus(
            dto.id,
            oldStatus,
            newStatus,
          ),
        ) as Response;
      }

      if (newStatus === 'VALIDATED') {
        const vehicleHasAlreadyAValidatedSale = await this.saleRepo.hasValidatedSiblingsSales(
          sale.vehicleId,
          sale.id,
        );

        if (vehicleHasAlreadyAValidatedSale) {
          return left(
            new UpdateSaleErrors.VehicleHasAlreadyAValidatedSale(
              sale.id,
              sale.vehicleId,
            ),
          ) as Response;
        }
      }

      sale.validationStatus = dto.validationStatus;
    }

    if (dto?.supplyType !== undefined) {
      sale.supplyType = dto.supplyType;
    }

    if (dto?.acceptAuction !== undefined) {
      sale.acceptAuction = dto.acceptAuction;
    }

    if (dto?.acceptImmediatePurchase !== undefined) {
      sale.acceptImmediatePurchase = dto.acceptImmediatePurchase;
    }

    if (dto?.acceptSubmission !== undefined) {
      sale.acceptSubmission = dto.acceptSubmission;
    }

    if (dto?.auctionStartPrice !== undefined) {
      sale.auctionStartPrice = dto.auctionStartPrice;
    }

    if (dto?.auctionStepPrice !== undefined) {
      sale.auctionStepPrice = dto.auctionStepPrice;
    }

    if (dto?.auctionReservePrice !== undefined) {
      sale.auctionReservePrice = dto.auctionReservePrice;
    }

    if (dto?.immediatePurchasePrice !== undefined) {
      sale.immediatePurchasePrice = dto.immediatePurchasePrice;
    }

    if (dto?.startDateTime !== undefined) {
      sale.startDateTime = dto.startDateTime;
    }

    if (dto?.endDateTime !== undefined) {
      sale.endDateTime = dto.endDateTime;
    }

    if (dto?.comment !== undefined) {
      sale.commentInt = await this.translateService.translateText(dto.comment);
      sale.comment = dto.comment;
    }

    if (dto?.assignedWinner !== undefined) {
      sale.assignedWinner = dto.assignedWinner;
      sale.winner = dto.assignedWinner;
    }

    if (dto?.assignedWinnerOffer !== undefined) {
      sale.assignedWinnerOffer = dto.assignedWinnerOffer;
    }

    if (dto?.winner === null) {
      sale.winner = dto.winner;
      sale.assignedWinner = dto.winner;
    }

    if (dto?.vehicleId !== undefined) {
      sale.vehicleId = dto.vehicleId;
    }

    if (dto?.ownerId !== undefined) {
      sale.ownerId = dto.ownerId;
    }

    if (dto?.groupId !== undefined) {
      sale.groupId = dto.groupId;
    }

    if (dto?.listId !== undefined) {
      sale.listId = dto.listId;
    }

    if (dto?.carcheckId !== undefined) {
      sale.carcheckId = dto.carcheckId;
    }

    if (dto?.expressSale !== undefined) {
      sale.expressSale = dto.expressSale;
    }

    sale.updatedBy = dto.updatedBy;

    const validation = sale.validate();

    // check if list id exists
    // check if group id exists
    // check if vehicle id exists
    // check if owner id exists

    if (validation.isSuccess) {
      await this.saleRepo.save(sale);
      if (dto?.assignedWinner) {
        const fullSale = await this.saleRepo.getSaleByIdWithOffers(sale.id);
        await this.messenger.publishMessage(
          'assignedWinnerNotification',
          SaleMap.toAssignedWinnerSaleNotificationDto(fullSale),
        );
      }
      return right(Result.ok<Sale>(sale));
    } else {
      return left(
        new UpdateSaleErrors.ValidationFailed(
          sale.id,
          validation.error.toString(),
        ),
      );
    }
  }
}
