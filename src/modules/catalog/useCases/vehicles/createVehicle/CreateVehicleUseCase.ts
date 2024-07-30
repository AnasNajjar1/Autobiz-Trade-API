import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { IVehicleRepo } from '../../../repos/vehicleRepo';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Vehicle } from '../../../domain/vehicle';
import { CreateVehicleErrors } from './CreateVehicleErrors';
import { CreateVehicleRequestDto } from './CreateVehicleRequestDto';
import { VehicleFileNumber } from '../../../domain/vehicleFileNumber';
import { VehicleProfileCosts } from '../../../domain/vehicleProfileCosts';
import { VehicleCarPictures } from '../../../domain/vehicleCarPictures';
import { VehicleCarPicturesOthers } from '../../../domain/vehicleCarPicturesOthers';
import { VehicleDamages } from '../../../domain/vehicleDamages';
import { VehicleKeyPoints } from '../../../domain/vehicleKeyPoints';
import { VehicleDocuments } from '../../../domain/vehicleDocuments';
import { VehicleDeclaredEquipments } from '../../../domain/vehicleDeclaredEquipments';
import { VehicleConstructorEquipments } from '../../../domain/vehicleConstructorEquipments';
import { VehicleWheelsDimension } from '../../../domain/vehicleWheelsDimensions';
import { MaskRegistrationListUseCase } from '../../../../image/useCases/maskRegistrationList/MaskRegistrationListUseCase';
import { IMessengerService } from '../../../../../infra/messenger/MessengerService';

type Response = Either<
  | CreateVehicleErrors.VehicleWithSameFileNumberAlreadyExistsError
  | CreateVehicleErrors.VehicleWithSameRegistrationAlreadyExistsError
  | AppError.UnexpectedError
  | Result<any>,
  Result<number>
>;

export class CreateVehicleUseCase
  implements UseCase<CreateVehicleRequestDto, Promise<Response>>
{
  private vehicleRepo: IVehicleRepo;
  private maskRegistrationListUseCase: MaskRegistrationListUseCase;
  private messenger: IMessengerService;

  constructor(
    vehicleRepo: IVehicleRepo,
    maskRegistrationListUseCase: MaskRegistrationListUseCase,
    messenger: IMessengerService,
  ) {
    this.vehicleRepo = vehicleRepo;
    this.maskRegistrationListUseCase = maskRegistrationListUseCase;
    this.messenger = messenger;
  }

  public async execute(dto: CreateVehicleRequestDto): Promise<any> {
    const fileNumberOrError = VehicleFileNumber.create(dto.fileNumber);
    const profileCostsOrError = VehicleProfileCosts.create(dto.profileCosts);
    const profileBodyCostsOrError = VehicleProfileCosts.create(
      dto.profileBodyCosts,
    );
    const carPicturesOrError = VehicleCarPictures.create(dto.carPictures);
    const carPicturesOthersOrError = VehicleCarPicturesOthers.create(
      dto.carPicturesOthers,
    );
    const damagesOrError = VehicleDamages.create(dto.damages);
    const keyPointsOrError = VehicleKeyPoints.create(dto.keyPoints);
    const documentsOrError = VehicleDocuments.create(dto.documents);
    const declaredEquipmentsOrError = VehicleDeclaredEquipments.create(
      dto.declaredEquipments,
    );
    const constructorEquipmentsOrError = VehicleConstructorEquipments.create(
      dto.constructorEquipments,
    );

    const wheelsFrontDimensionsOrError = VehicleWheelsDimension.create(
      dto.wheelsFrontDimensions,
    );
    const wheelsBackDimensionsOrError = VehicleWheelsDimension.create(
      dto.wheelsBackDimensions,
    );

    const combinedPropsResult = Result.combine([
      fileNumberOrError,
      profileCostsOrError,
      profileBodyCostsOrError,
      carPicturesOrError,
      carPicturesOthersOrError,
      damagesOrError,
      keyPointsOrError,
      documentsOrError,
      declaredEquipmentsOrError,
      constructorEquipmentsOrError,
      wheelsFrontDimensionsOrError,
      wheelsBackDimensionsOrError,
    ]);

    if (combinedPropsResult.isFailure) {
      return left(combinedPropsResult);
    }

    const fileNumber: VehicleFileNumber = fileNumberOrError.getValue();
    const profileCosts: VehicleProfileCosts = profileCostsOrError.getValue();
    const profileBodyCosts: VehicleProfileCosts =
      profileBodyCostsOrError.getValue();
    const carPictures: VehicleCarPictures = carPicturesOrError.getValue();
    const carPicturesOthers: VehicleCarPicturesOthers =
      carPicturesOthersOrError.getValue();
    const damages: VehicleDamages = damagesOrError.getValue();
    const keyPoints: VehicleDamages = keyPointsOrError.getValue();
    const documents: VehicleDocuments = documentsOrError.getValue();
    const declaredEquipments: VehicleDeclaredEquipments =
      declaredEquipmentsOrError.getValue();
    const constructorEquipments: VehicleConstructorEquipments =
      constructorEquipmentsOrError.getValue();

    const wheelsFrontDimensions: VehicleWheelsDimension =
      wheelsFrontDimensionsOrError.getValue();
    const wheelsBackDimensions: VehicleWheelsDimension =
      wheelsBackDimensionsOrError.getValue();

    let listCarPictures = [];
    if (carPictures.value) {
      listCarPictures = Object.entries(carPictures.value).map(
        ([title, url]) => ({
          title,
          url,
        }),
      );
    }

    let listCarPicturesOthers = [];
    if (carPicturesOthers.value) {
      listCarPicturesOthers = carPicturesOthers.value.map(
        ({ title, link: url }) => ({ title, url }),
      );
    }

    const listPictures = [...listCarPictures, ...listCarPicturesOthers];
    if (listPictures.length > 0)
      await this.maskRegistrationListUseCase.execute(listPictures);

    try {
      const vehicleOrError: Result<Vehicle> = Vehicle.create({
        fileNumber,
        brandLabel: dto.brandLabel,
        modelLabel: dto.modelLabel,
        versionLabel: dto.versionLabel,
        firstRegistrationDate: dto.firstRegistrationDate,
        profileCosts,
        profileBodyCosts,
        carPictures,
        carPicturesOthers,
        damages,
        pointOfSaleId: dto.pointofsale?.id,
        keyPoints,
        documents,
        declaredEquipments,
        constructorEquipments,
        mileage: dto.mileage,
        fuelLabel: dto.fuelLabel,
        liter: dto.liter,
        gearBoxLabel: dto.gearBoxLabel,
        seats: dto.seats,
        door: dto.door,
        ch: dto.ch,
        kw: dto.kw,
        fiscal: dto.fiscal,
        wheelsFrontDimensions,
        wheelsBackDimensions,
        wheelsFrontTireBrand: dto.wheelsFrontTireBrand,
        wheelsBackTireBrand: dto.wheelsBackTireBrand,
        rimTypeFront: dto.rimTypeFront,
        rimTypeBack: dto.rimTypeBack,
        metallic: dto.metallic,
        purchaseDate: dto.purchaseDate,
        gcDate: dto.gcDate,
        registration: dto.registration,
        firstHand: dto.firstHand,
        vehicleType: dto.vehicleType,
        co2: dto.co2,
        userManual: dto.userManual,
        secondSetKey: dto.secondSetKey,
        origin: dto.origin,
        purchaseInvoice: dto.purchaseInvoice,
        vat: dto.vat,
        vatDetails: dto.vatDetails,
        imported: dto.imported,
        servicingHistory: dto.servicingHistory,
        servicingInBrandNetwork: dto.servicingInBrandNetwork,
        servicingManualPicture: dto.servicingManualPicture,
        servicingInvoices: dto.servicingInvoices,
        lastServicingDate: dto.lastServicingDate,
        lastServicingKm: dto.lastServicingKm,
        distributionBelt: dto.distributionBelt,
        nextTechnicalCheckDate: dto.nextTechnicalCheckDate,
        b2cMarketValue: dto.b2cMarketValue,
        standardMileage: dto.standardMileage,
        dpaProAmt: dto.dpaProAmt,
        salesSpeedName: dto.salesSpeedName,
        marketLink: dto.marketLink,
        marketDataDate: dto.marketDataDate,
        vin: dto.vin,
        userId: dto.userId,
        createdBy: dto.createdBy,
        entryStockDate: dto.entryStockDate,
        color: dto.color,
        reconditioningCostsMerchant: dto.reconditioningCostsMerchant,
      });
      if (vehicleOrError.isFailure) {
        return left(new AppError.UnexpectedError(vehicleOrError)) as Response;
      }

      const vehicle = await this.vehicleRepo.save(vehicleOrError.getValue());
      await this.messenger.publishMessage('compressMainPhoto', {
        id: vehicle,
      });

      return right(Result.ok(vehicle));
    } catch (err) {
      return left(new AppError.UnexpectedError(err)) as Response;
    }
  }
}
