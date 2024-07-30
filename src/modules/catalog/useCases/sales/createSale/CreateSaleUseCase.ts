import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { ISaleRepo } from '../../../repos/saleRepo';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Sale, SaleProps } from '../../../domain/sale';
import { CreateSaleRequestDto } from './CreateSaleRequestDto';
import { CreateSaleErrors } from './CreateSaleErrors';
import { SaleService } from '../../../domain/services/saleService';
import { IVehicleRepo } from '../../../repos/vehicleRepo';
import {
  saleCreatedEvent,
  SaleCreatedEventProps,
} from '../../../events/saleCreatedEvent';
import { IUserRepo } from '../../../../user/repos/userRepo';
import { getUserInfos } from '../../../../../infra/deprecated/user-lib';
import { IGroupRepo } from '../../../../group/repos/groupRepo';
import { ITranslateService } from '../../../../../infra/translate/translateService';
type Response = Either<AppError.UnexpectedError | Result<any>, Result<number>>;

export class CreateSaleUseCase
  implements UseCase<CreateSaleRequestDto, Promise<Response>> {
  private saleRepo: ISaleRepo;
  private vehicleRepo: IVehicleRepo;
  private userRepo: IUserRepo;
  private groupRepo: IGroupRepo;
  private translateService: ITranslateService;

  constructor(
    saleRepo: ISaleRepo,
    vehicleRepo: IVehicleRepo,
    userRepo: IUserRepo,
    groupRepo: IGroupRepo,
    translateService?: ITranslateService,
  ) {
    this.saleRepo = saleRepo;
    this.vehicleRepo = vehicleRepo;
    this.userRepo = userRepo;
    this.groupRepo = groupRepo;
    this.translateService = translateService;
  }

  public async execute(dto: CreateSaleRequestDto): Promise<Response> {
    const saleProps: SaleProps = {
      validationStatus: dto.validationStatus || 'DRAFT',
      supplyType: dto.supplyType,
      acceptAuction: dto.acceptAuction || false,
      acceptImmediatePurchase: dto.acceptImmediatePurchase || false,
      acceptSubmission: dto.acceptSubmission || false,
      auctionStartPrice: dto.auctionStartPrice,
      auctionStepPrice: dto.auctionStepPrice,
      auctionReservePrice: dto.auctionReservePrice,
      immediatePurchasePrice: dto.immediatePurchasePrice,
      startDateTime: dto.startDateTime,
      endDateTime: dto.endDateTime,
      comment: dto.comment,
      vehicleId: dto.vehicleId,
      ownerId: dto.ownerId,
      groupId: dto.groupId,
      listId: dto.listId,
      carcheckId: dto.carcheckId,
      expressSale: dto.expressSale,
      createdBy: dto.createdBy,
    };

    if (dto.expressSale === true && !saleProps.startDateTime) {
      saleProps.startDateTime = new Date();
    }

    if (dto.expressSale === true && !saleProps.endDateTime) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      saleProps.endDateTime = tomorrow;
    }

    // Translate comment
    if (dto?.comment) {
      saleProps.commentInt = await this.translateService.translateText(
        dto.comment,
      );
    }

    // Check if vehicle exists
    if (dto?.vehicleId) {
      const vehicleExist = await this.vehicleRepo.exists(dto.vehicleId);

      if (!vehicleExist) {
        return left(
          new CreateSaleErrors.VehicleNotFound(saleProps.vehicleId),
        ) as Response;
      }
    }

    // Can accept a validated sale
    if (saleProps.validationStatus === 'VALIDATED') {
      const vehicleHasAlreadyAValidatedSale = await this.saleRepo.hasValidatedSiblingsSales(
        saleProps.vehicleId,
      );

      if (vehicleHasAlreadyAValidatedSale) {
        return left(
          new CreateSaleErrors.VehicleHasAlreadyAValidatedSale(
            saleProps.vehicleId,
          ),
        ) as Response;
      }
    }

    let owner;
    if (dto?.ownerId) {
      try {
        const userAt = await this.userRepo.getUserById(dto.ownerId);
        owner = await getUserInfos(userAt.autobizUserId.value);
      } catch (error) {
        return left(
          new CreateSaleErrors.OwnerNotFound(dto.ownerId),
        ) as Response;
      }
    }

    let group;
    if (dto?.groupId) {
      try {
        group = await this.groupRepo.getGroupById(dto.groupId);
      } catch (error) {
        return left(
          new CreateSaleErrors.GroupNotFound(dto.groupId),
        ) as Response;
      }
    }

    // Create sale entity
    const saleOrError = Sale.create(saleProps);

    if (saleOrError.isFailure) {
      return left(saleOrError);
    }

    const sale = saleOrError.getValue();

    // Validate sale property
    const validation = sale.validate();

    if (validation.isSuccess) {
      const newSaleId = await this.saleRepo.save(sale);

      const newSale = await this.saleRepo.getSaleById(newSaleId);

      const { vehicle, expressSale, supplyType, validationStatus } = newSale;

      if (vehicle) {
        const saleCreatedProps: SaleCreatedEventProps = {
          fileNumber: vehicle.fileNumber?.value || '',
          brandLabel: vehicle.brandLabel,
          modelLabel: vehicle.modelLabel,
          versionLabel: vehicle.versionLabel || '',
          mileage: vehicle.mileage,
          expressSale: expressSale,
          buyerFirstName: owner?.firstname || '',
          buyerLastName: owner?.lastname || '',
          buyerId: owner?.userId || '',
          buyerEmail: process.env.emailFrom, // support email
          city: vehicle.pointofsale.city || '',
          groupName: owner?.subscription.name || '',
          offerType: supplyType,
          saleStatus: validationStatus,
          ownerCountry: owner?.country || '',
        };
        await saleCreatedEvent(saleCreatedProps);
      }
      return right(Result.ok(newSaleId));
    } else {
      return left(
        new CreateSaleErrors.ValidationFailed(validation.error.toString()),
      );
    }
  }
}
