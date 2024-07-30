import { BaseController } from '../../../../../core/infra/BaseController';
import { VehicleMap } from '../../../mappers/VehicleMap';
import { UpdateVehicleUseCase } from './UpdateVehicleUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { UpdateVehicleErrors } from './UpdateVehicleErrors';
import { UpdateVehicleRequestDto } from './UpdateVehicleRequestDto';
import { UpdateVehicleResponseDto } from './UpdateVehicleResponseDto';

export class UpdateVehicleController extends BaseController {
  private useCase: UpdateVehicleUseCase;

  constructor(useCase: UpdateVehicleUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const {
      fileNumber,
      vin,
      brandLabel,
      modelLabel,
      versionLabel,
      firstRegistrationDate,
      profileCosts,
      profileBodyCosts,
      carPictures,
      carPicturesOthers,
      damages,
      pointofsale,
      keyPoints,
      documents,
      declaredEquipments,
      constructorEquipments,
      mileage,
      fuelLabel,
      liter,
      gearBoxLabel,
      seats,
      door,
      ch,
      kw,
      fiscal,
      wheelsFrontDimensions,
      wheelsBackDimensions,
      wheelsFrontTireBrand,
      wheelsBackTireBrand,
      rimTypeFront,
      rimTypeBack,
      metallic,
      purchaseDate,
      gcDate,
      registration,
      firstHand,
      vehicleType,
      co2,
      userManual,
      secondSetKey,
      origin,
      purchaseInvoice,
      vat,
      vatDetails,
      imported,
      servicingHistory,
      servicingInBrandNetwork,
      servicingManualPicture,
      servicingInvoices,
      lastServicingDate,
      lastServicingKm,
      distributionBelt,
      nextTechnicalCheckDate,
      b2cMarketValue,
      standardMileage,
      dpaProAmt,
      salesSpeedName,
      marketLink,
      entryStockDate,
      color,
      reconditioningCostsMerchant,
    } = request.body;

    const dto = {
      id: request.path.id,
      fileNumber,
      vin,
      brandLabel,
      modelLabel,
      versionLabel,
      firstRegistrationDate,
      profileCosts,
      profileBodyCosts,
      carPictures,
      carPicturesOthers,
      damages,
      pointofsale,
      keyPoints,
      documents,
      declaredEquipments,
      constructorEquipments,
      mileage,
      fuelLabel,
      liter,
      gearBoxLabel,
      seats,
      door,
      ch,
      kw,
      fiscal,
      wheelsFrontDimensions,
      wheelsBackDimensions,
      wheelsFrontTireBrand,
      wheelsBackTireBrand,
      rimTypeFront,
      rimTypeBack,
      metallic,
      purchaseDate,
      gcDate,
      registration,
      firstHand,
      vehicleType,
      co2,
      userManual,
      secondSetKey,
      origin,
      purchaseInvoice,
      vat,
      vatDetails: vat ? vatDetails : null,
      imported,
      servicingHistory,
      servicingInBrandNetwork,
      servicingManualPicture,
      servicingInvoices,
      lastServicingDate,
      lastServicingKm,
      distributionBelt,
      nextTechnicalCheckDate,
      b2cMarketValue,
      standardMileage,
      dpaProAmt,
      salesSpeedName,
      marketLink,
      updatedBy: request.user,
      entryStockDate,
      color,
      reconditioningCostsMerchant,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const id = result.value.getValue();
        return this.created<UpdateVehicleResponseDto>({ id });
      } else {
        switch (result.value.constructor) {
          case UpdateVehicleErrors.VehicleWithSameFileNumberAlreadyExistsError:
          case UpdateVehicleErrors.VehicleWithSameRegistrationAlreadyExistsError:
            return this.conflict(result.value.errorValue().message);
          default:
            return this.fail(result.value.error);
        }
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
