import { BaseController } from '../../../../../core/infra/BaseController';
import { VehicleMap } from '../../../mappers/VehicleMap';
import { CreateVehicleUseCase } from './CreateVehicleUseCase';
import { HttpRequestDto } from '../../../../../infra/http/HttpRequest';
import { CreateVehicleErrors } from './CreateVehicleErrors';
import { CreateVehicleRequestDto } from './CreateVehicleRequestDto';
import { CreateVehicleResponseDto } from './CreateVehicleResponseDto';

export class CreateVehicleController extends BaseController {
  private useCase: CreateVehicleUseCase;

  constructor(useCase: CreateVehicleUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(request: HttpRequestDto): Promise<any> {
    const {
      fileNumber,
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
      marketDataDate,
      entryStockDate,
      color,
      reconditioningCostsMerchant,
    } = request.body;

    const dto: CreateVehicleRequestDto = {
      fileNumber,
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
      marketDataDate,
      userId: request.user,
      createdBy: request.user,
      entryStockDate,
      color,
      reconditioningCostsMerchant,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isRight()) {
        const id = result.value.getValue();
        return this.created<CreateVehicleResponseDto>({ id });
      } else {
        switch (result.value.constructor) {
          case CreateVehicleErrors.VehicleWithSameFileNumberAlreadyExistsError:
          case CreateVehicleErrors.VehicleWithSameRegistrationAlreadyExistsError:
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
