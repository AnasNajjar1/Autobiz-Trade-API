import { left, Result, Either, right } from '../../../../../core/logic/Result';
import { IVehicleRepo } from '../../../repos/vehicleRepo';
import { UseCase } from '../../../../../core/logic/UseCase';
import { AppError } from '../../../../../core/logic/AppError';
import { Vehicle } from '../../../domain/vehicle';
import { UpdateVehicleErrors } from './UpdateVehicleErrors';
import { UpdateVehicleRequestDto } from './UpdateVehicleRequestDto';
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
import { WithChanges, Changes } from '../../../../../core/logic/WithChanges';
import { MaskRegistrationListUseCase } from '../../../../image/useCases/maskRegistrationList/MaskRegistrationListUseCase';

type Response = Either<
  | UpdateVehicleErrors.VehicleWithSameFileNumberAlreadyExistsError
  | UpdateVehicleErrors.VehicleWithSameRegistrationAlreadyExistsError
  | AppError.UnexpectedError
  | Result<any>,
  Result<number>
>;

export class UpdateVehicleUseCase
  implements UseCase<UpdateVehicleRequestDto, Promise<Response>>, WithChanges
{
  private vehicleRepo: IVehicleRepo;
  private maskRegistrationListUseCase: MaskRegistrationListUseCase;
  public changes: Changes;

  constructor(
    vehicleRepo: IVehicleRepo,
    maskRegistrationListUseCase: MaskRegistrationListUseCase,
  ) {
    this.vehicleRepo = vehicleRepo;
    this.maskRegistrationListUseCase = maskRegistrationListUseCase;
    this.changes = new Changes();
  }

  public async execute(dto: UpdateVehicleRequestDto): Promise<any> {
    let vehicle: Vehicle;
    try {
      vehicle = await this.vehicleRepo.getAdminVehicleById(dto.id);
    } catch (err) {
      return left(
        new UpdateVehicleErrors.VehicleNotFoundError(dto.id),
      ) as Response;
    }

    if (dto?.fileNumber !== undefined) {
      const fileNumberOrError: Result<VehicleFileNumber> =
        VehicleFileNumber.create(dto.fileNumber);
      if (fileNumberOrError.isSuccess) {
        this.changes.addChange(
          vehicle.updateFileNumber(fileNumberOrError.getValue()),
        );
      } else {
        return left(fileNumberOrError);
      }
    }

    if (dto?.vin !== undefined) {
      this.changes.addChange(vehicle.updateVin(dto.vin));
    }

    if (dto?.brandLabel !== undefined) {
      this.changes.addChange(vehicle.updateBrandLabel(dto.brandLabel));
    }

    if (dto?.modelLabel !== undefined) {
      this.changes.addChange(vehicle.updateModelLabel(dto.modelLabel));
    }

    if (dto?.versionLabel !== undefined) {
      this.changes.addChange(vehicle.updateVersionLabel(dto.versionLabel));
    }

    if (dto?.firstRegistrationDate !== undefined) {
      this.changes.addChange(
        vehicle.updateFirstRegistrationDate(dto.firstRegistrationDate),
      );
    }

    if (dto?.profileCosts !== undefined) {
      const profileCostsOrError: Result<VehicleProfileCosts> =
        VehicleProfileCosts.create(dto.profileCosts);
      if (profileCostsOrError.isSuccess) {
        this.changes.addChange(
          vehicle.updateProfileCosts(profileCostsOrError.getValue()),
        );
      } else {
        return left(profileCostsOrError);
      }
    }

    if (dto?.profileBodyCosts !== undefined) {
      const profileBodyCostsOrError: Result<VehicleProfileCosts> =
        VehicleProfileCosts.create(dto.profileBodyCosts);
      if (profileBodyCostsOrError.isSuccess) {
        this.changes.addChange(
          vehicle.updateProfileBodyCosts(profileBodyCostsOrError.getValue()),
        );
      } else {
        return left(profileBodyCostsOrError);
      }
    }

    if (dto?.carPictures !== undefined) {
      const carPicturesOrError: Result<VehicleCarPictures> =
        VehicleCarPictures.create(dto.carPictures);
      if (carPicturesOrError.isSuccess) {
        this.changes.addChange(
          vehicle.updateCarPictures(carPicturesOrError.getValue()),
        );

        // const listPictures = Object.entries(carPicturesOrError.value).map(([title, url])=>({
        //   title, url
        // }))
        // await this.maskRegistrationListUseCase.execute(listPictures)
      } else {
        return left(carPicturesOrError);
      }
    }

    if (dto?.carPicturesOthers !== undefined) {
      const carPicturesOthersOrError: Result<VehicleCarPicturesOthers> =
        VehicleCarPicturesOthers.create(dto.carPicturesOthers);
      if (carPicturesOthersOrError.isSuccess) {
        this.changes.addChange(
          vehicle.updateCarPicturesOthers(carPicturesOthersOrError.getValue()),
        );
      } else {
        return left(carPicturesOthersOrError);
      }
    }

    if (dto?.damages !== undefined) {
      const damagesOrError: Result<VehicleDamages> = VehicleDamages.create(
        dto.damages,
      );
      if (damagesOrError.isSuccess) {
        this.changes.addChange(
          vehicle.updateDamages(damagesOrError.getValue()),
        );
      } else {
        return left(damagesOrError);
      }
    }

    if (dto?.pointofsale?.id !== undefined) {
      this.changes.addChange(vehicle.updatePointOfSaleId(dto.pointofsale.id));
    }

    if (dto?.keyPoints !== undefined) {
      const keyPointsOrError: Result<VehicleKeyPoints> =
        VehicleKeyPoints.create(dto.keyPoints);
      if (keyPointsOrError.isSuccess) {
        this.changes.addChange(
          vehicle.updateKeyPoints(keyPointsOrError.getValue()),
        );
      } else {
        return left(keyPointsOrError);
      }
    }

    if (dto?.documents !== undefined) {
      const documentsOrError: Result<VehicleDocuments> =
        VehicleDocuments.create(dto.documents);
      if (documentsOrError.isSuccess) {
        this.changes.addChange(
          vehicle.updateDocuments(documentsOrError.getValue()),
        );
      } else {
        return left(documentsOrError);
      }
    }

    if (dto?.declaredEquipments !== undefined) {
      const declaredEquipmentsOrError: Result<VehicleDeclaredEquipments> =
        VehicleDeclaredEquipments.create(dto.declaredEquipments);
      if (declaredEquipmentsOrError.isSuccess) {
        this.changes.addChange(
          vehicle.updateDeclaredEquipments(
            declaredEquipmentsOrError.getValue(),
          ),
        );
      } else {
        return left(declaredEquipmentsOrError);
      }
    }

    if (dto?.constructorEquipments !== undefined) {
      const constructorEquipmentsOrError: Result<VehicleConstructorEquipments> =
        VehicleConstructorEquipments.create(dto.constructorEquipments);
      if (constructorEquipmentsOrError.isSuccess) {
        this.changes.addChange(
          vehicle.updateConstructorEquipments(
            constructorEquipmentsOrError.getValue(),
          ),
        );
      } else {
        return left(constructorEquipmentsOrError);
      }
    }

    if (dto?.mileage !== undefined) {
      this.changes.addChange(vehicle.updateMileage(dto.mileage));
    }

    if (dto?.fuelLabel !== undefined) {
      this.changes.addChange(vehicle.updateFuelLabel(dto.fuelLabel));
    }

    if (dto?.liter !== undefined) {
      this.changes.addChange(vehicle.updateLiter(dto.liter));
    }

    if (dto?.gearBoxLabel !== undefined) {
      this.changes.addChange(vehicle.updateGearBoxLabel(dto.gearBoxLabel));
    }

    if (dto?.seats !== undefined) {
      this.changes.addChange(vehicle.updateSeats(dto.seats));
    }

    if (dto?.door !== undefined) {
      this.changes.addChange(vehicle.updateDoor(dto.door));
    }

    if (dto?.ch !== undefined) {
      this.changes.addChange(vehicle.updateCh(dto.ch));
    }

    if (dto?.kw !== undefined) {
      this.changes.addChange(vehicle.updateKw(dto.kw));
    }

    if (dto?.fiscal !== undefined) {
      this.changes.addChange(vehicle.updateFiscal(dto.fiscal));
    }

    if (dto?.wheelsFrontDimensions !== undefined) {
      const wheelsFrontDimensionsOrError: Result<VehicleWheelsDimension> =
        VehicleWheelsDimension.create(dto.wheelsFrontDimensions);
      if (wheelsFrontDimensionsOrError.isSuccess) {
        this.changes.addChange(
          vehicle.updateWheelsFrontDimensions(
            wheelsFrontDimensionsOrError.getValue(),
          ),
        );
      } else {
        return left(wheelsFrontDimensionsOrError);
      }
    }

    if (dto?.wheelsBackDimensions !== undefined) {
      const wheelsBackDimensionsOrError: Result<VehicleWheelsDimension> =
        VehicleWheelsDimension.create(dto.wheelsBackDimensions);
      if (wheelsBackDimensionsOrError.isSuccess) {
        this.changes.addChange(
          vehicle.updateWheelsBackDimensions(
            wheelsBackDimensionsOrError.getValue(),
          ),
        );
      } else {
        return left(wheelsBackDimensionsOrError);
      }
    }

    if (dto?.wheelsFrontTireBrand !== undefined) {
      this.changes.addChange(
        vehicle.updateWheelsFrontTireBrand(dto.wheelsFrontTireBrand),
      );
    }

    if (dto?.wheelsBackTireBrand !== undefined) {
      this.changes.addChange(
        vehicle.updateWheelsBackTireBrand(dto.wheelsBackTireBrand),
      );
    }

    if (dto?.rimTypeFront !== undefined) {
      this.changes.addChange(vehicle.updateRimTypeFront(dto.rimTypeFront));
    }

    if (dto?.rimTypeBack !== undefined) {
      this.changes.addChange(vehicle.updateRimTypeBack(dto.rimTypeBack));
    }

    if (dto?.metallic !== undefined) {
      this.changes.addChange(vehicle.updateMetallic(dto.metallic));
    }

    if (dto?.purchaseDate !== undefined) {
      this.changes.addChange(vehicle.updatePurchaseDate(dto.purchaseDate));
    }

    if (dto?.gcDate !== undefined) {
      this.changes.addChange(vehicle.updateGcDate(dto.gcDate));
    }

    if (dto?.registration !== undefined) {
      this.changes.addChange(vehicle.updateRegistration(dto.registration));
    }

    if (dto?.firstHand !== undefined) {
      this.changes.addChange(vehicle.updateFirstHand(dto.firstHand));
    }

    if (dto?.vehicleType !== undefined) {
      this.changes.addChange(vehicle.updateVehicleType(dto.vehicleType));
    }

    if (dto?.co2 !== undefined) {
      this.changes.addChange(vehicle.updateCo2(dto.co2));
    }

    if (dto?.userManual !== undefined) {
      this.changes.addChange(vehicle.updateUserManual(dto.userManual));
    }

    if (dto?.secondSetKey !== undefined) {
      this.changes.addChange(vehicle.updateSecondSetKey(dto.secondSetKey));
    }

    if (dto?.origin !== undefined) {
      this.changes.addChange(vehicle.updateOrigin(dto.origin));
    }

    if (dto?.purchaseInvoice !== undefined) {
      this.changes.addChange(
        vehicle.updatePurchaseInvoice(dto.purchaseInvoice),
      );
    }

    if (dto?.vat !== undefined) {
      this.changes.addChange(vehicle.updateVat(dto.vat));
    }

    if (dto?.vatDetails !== undefined) {
      this.changes.addChange(vehicle.updateVatDetails(dto.vatDetails));
    }

    if (dto?.imported !== undefined) {
      this.changes.addChange(vehicle.updateImported(dto.imported));
    }

    if (dto?.servicingHistory !== undefined) {
      this.changes.addChange(
        vehicle.updateServicingHistory(dto.servicingHistory),
      );
    }

    if (dto?.servicingInBrandNetwork !== undefined) {
      this.changes.addChange(
        vehicle.updateServicingInBrandNetwork(dto.servicingInBrandNetwork),
      );
    }

    if (dto?.servicingManualPicture !== undefined) {
      this.changes.addChange(
        vehicle.updateServicingManualPicture(dto.servicingManualPicture),
      );
    }

    if (dto?.servicingInvoices !== undefined) {
      this.changes.addChange(
        vehicle.updateServicingInvoices(dto.servicingInvoices),
      );
    }

    if (dto?.lastServicingDate !== undefined) {
      this.changes.addChange(
        vehicle.updateLastServicingDate(dto.lastServicingDate),
      );
    }

    if (dto?.lastServicingKm !== undefined) {
      this.changes.addChange(
        vehicle.updateLastServicingKm(dto.lastServicingKm),
      );
    }

    if (dto?.distributionBelt !== undefined) {
      this.changes.addChange(
        vehicle.updateDistributionBelt(dto.distributionBelt),
      );
    }

    if (dto?.nextTechnicalCheckDate !== undefined) {
      this.changes.addChange(
        vehicle.updateNextTechnicalCheckDate(dto.nextTechnicalCheckDate),
      );
    }
    if (dto?.reconditioningCostsMerchant !== undefined) {
      this.changes.addChange(
        vehicle.updateReconditioningCostsMerchant(
          dto.reconditioningCostsMerchant,
        ),
      );
    }
    if (dto?.b2cMarketValue !== undefined) {
      this.changes.addChange(vehicle.updateB2cMarketValue(dto.b2cMarketValue));
    }

    if (dto?.standardMileage !== undefined) {
      this.changes.addChange(
        vehicle.updateStandardMileage(dto.standardMileage),
      );
    }

    if (dto?.dpaProAmt !== undefined) {
      this.changes.addChange(vehicle.updateDpaProAmt(dto.dpaProAmt));
    }

    if (dto?.salesSpeedName !== undefined) {
      this.changes.addChange(vehicle.updateSalesSpeedName(dto.salesSpeedName));
    }

    if (dto?.marketLink !== undefined) {
      this.changes.addChange(vehicle.updateMarketLink(dto.marketLink));
    }

    if (dto?.color !== undefined) {
      this.changes.addChange(vehicle.updateColor(dto.color));
    }

    if (dto?.entryStockDate !== undefined) {
      this.changes.addChange(vehicle.updateEntryStockDate(dto.entryStockDate));
    }

    this.changes.addChange(vehicle.updateUpdatedBy(dto.updatedBy));

    if (this.changes.getCombinedChangesResult().isSuccess) {
      try {
        const vehicleId = await this.vehicleRepo.save(vehicle);

        return right(Result.ok(vehicleId));
      } catch (err) {
        return left(new AppError.UnexpectedError(err)) as Response;
      }
    }
  }
  catch(err) {
    return left(new AppError.UnexpectedError(err)) as Response;
  }
}
