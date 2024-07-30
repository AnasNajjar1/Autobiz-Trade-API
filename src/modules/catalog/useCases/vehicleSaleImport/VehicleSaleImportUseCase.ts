import { left, Result, right, Either } from '../../../../core/logic/Result';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import {
  VehicleSaleImporRequestDto,
  vehicleIdentificationDto,
  VehicleSaleImportDto,
} from './VehicleSaleImportRequestDto';
import { IImportRepo } from '../../../fileImport/repos/importRepo';
import { IFileService } from '../../../../infra/fileService/FileService';
import { VehicleSaleImportErrors } from './VehicleSaleImportErrors';
import { VehicleFileNumber } from '../../domain/vehicleFileNumber';
import { IApiReferentialService } from '../../../../infra/autobizApi/ApiReferentialService/IApiReferentialService';
import { randomHexaId } from '../../../../shared/helpers/VehicleHelper';
import { IVehicleRepo } from '../../repos/vehicleRepo';
import { Vehicle } from '../../domain/vehicle';
import { Sale, SaleProps } from '../../domain/sale';
import { ISaleRepo } from '../../repos/saleRepo';
import { IGroupRepo } from '../../../group/repos/groupRepo';
import { ITranslateService } from '../../../../infra/translate/translateService';
import _ from 'lodash';
import { VehicleSaleImportMap } from '../../mappers/VehicleSaleImportMap';
import { VehicleSaleImporCreated } from './VehicleSaleImportResponseDto';
import moment from 'moment';
import { IApiQuotationService } from '../../../../infra/autobizApi/ApiQuotationService/ApiQuotationService';

type Response = Either<
  | VehicleSaleImportErrors.VehicleWithSameFileNumberAlreadyExistsError
  | VehicleSaleImportErrors.VehicleWithSameRegistrationAlreadyExistsError
  | AppError.UnexpectedError,
  Result<string>
>;
export class VehicleSaleImportUseCase
  implements UseCase<VehicleSaleImporRequestDto, Promise<Response>>
{
  private importRepo: IImportRepo;
  private fileService: IFileService;
  private apiReferentialService: IApiReferentialService;
  private vehicleRepo: IVehicleRepo;
  private saleRepo: ISaleRepo;
  private groupRepo: IGroupRepo;
  private translateService: ITranslateService;
  private apiQuotationService: IApiQuotationService;

  constructor(
    importRepo: IImportRepo,
    fileService: IFileService,
    apiReferentialService: IApiReferentialService,
    vehicleRepo: IVehicleRepo,
    saleRepo: ISaleRepo,
    groupRepo: IGroupRepo,
    translateService: ITranslateService,
    apiQuotationService: IApiQuotationService,
  ) {
    this.importRepo = importRepo;
    this.fileService = fileService;
    this.apiReferentialService = apiReferentialService;
    this.vehicleRepo = vehicleRepo;
    this.saleRepo = saleRepo;
    this.groupRepo = groupRepo;
    this.translateService = translateService;
    this.apiQuotationService = apiQuotationService;
  }

  public async execute(request: VehicleSaleImporRequestDto): Promise<Response> {
    const { uuid } = request;
    try {
      const fileBody = await this.fileService.getExcel(uuid);
      const headers = fileBody.shift();
      let msg = '';
      let ligne = 2;
      for await (const row of fileBody) {
        const result = await this.createVehicleAndSale(
          VehicleSaleImportMap.excelToVehicleSale(headers, row),
          ligne,
        );
        if (result?.isLeft())
          msg += result.value.errorValue().message + '</br> ';
        ligne++;
      }

      await this.importRepo.update(msg, 'finished', uuid);
      return right(Result.ok(uuid));
    } catch (err) {
      console.warn(err.message);
      await this.importRepo.update(err.message, 'failed', uuid);
      return left(Result.fail(err.message));
    }
  }

  private async createVehicleAndSale(
    dto: VehicleSaleImportDto,
    ligne: number,
  ): Promise<any> {
    try {
      const {
        createVehicle,
        createSale,
        vinAnalysis,
        registration,
        vin,
        country,
      } = dto;
      let vehicleId;
      let saleId;

      if (createVehicle) {
        // DÉCODE IMMAT/VIN
        const vehicleIdentificationDto: vehicleIdentificationDto = {
          vinAnalysis,
          country,
          registration,
          vin,
        };
        const identificationOrError = await this.identificateVehicule(
          vehicleIdentificationDto,
        );
        if (identificationOrError?.isLeft()) {
          return left(new VehicleSaleImportErrors.VehicleNotRecognized(ligne));
        }

        const {
          makeName,
          modelName,
          dateGrayCard,
          co2Emissions,
          liter,
          doors,
          seats,
          kw,
          fuelName,
          gearboxName,
          engine,
          fiscal,
          makeId,
          modelId,
          fuelId,
          gearboxId,
          bodyId,
          dateRelease,
        } = identificationOrError.value.getValue();

        dto = {
          ...dto,
          brandLabel: makeName,
          modelLabel: modelName,
          gcDate: dateGrayCard ? dateGrayCard : dto.gcDate,
          co2: co2Emissions,
          liter,
          ch: engine,
          fiscal,
          door: doors ? doors : dto.door,
          seats: seats ? seats : dto.seats,
          kw: kw ? kw : dto.kw,
          fuelLabel: fuelName ? fuelName : dto.fuelLabel,
          gearBoxLabel: gearboxName ? gearboxName : dto.gearBoxLabel,
          firstRegistrationDate: dateRelease
            ? dateRelease
            : dto.firstRegistrationDate,
        };

        // GET QUOTATION INFOS
        const params = {
          makeId,
          modelId,
          bodyId,
          fuelId,
          gearId: gearboxId,
          year: moment(dateRelease).year(),
          mileage: dto.mileage,
          engine,
          doors: dto.door,
          seats: dto.seats,
          country: dto.country,
        };
        const result = await this.apiQuotationService.getQuotationByReference(
          params,
        );
        if (result.isRight()) {
          const response = result.value.getValue();
          if (response.status) {
            dto.b2cMarketValue =
              response._quotation?.b2cMarketValue !== 0
                ? response._quotation?.b2cMarketValue
                : response._quotation?.mcclbp;
            dto.standardMileage = response.standardMileage;
            dto.dpaProAmt = response._marketInformation?.transactionSpread;
            dto.salesSpeedName = response._salesSpeed?.name;
            if (dto.country !== 'ES')
              dto.marketLink = response._links?.marketAnalysis;
            dto.marketDataDate = new Date();
          }
        }

        // SAVE VAHICULE
        const fileNumberOrError = VehicleFileNumber.create(
          dto.fileNumber ? dto.fileNumber : randomHexaId(6),
        );
        const fileNumber: VehicleFileNumber = fileNumberOrError.getValue();
        const vehicleOrError: Result<Vehicle> = Vehicle.create({
          fileNumber,
          brandLabel: dto.brandLabel,
          modelLabel: dto.modelLabel,
          versionLabel: dto.versionLabel,
          firstRegistrationDate: dto.firstRegistrationDate,
          pointOfSaleId: dto.pointOfSaleId,
          mileage: dto.mileage,
          fuelLabel: dto.fuelLabel,
          liter: dto.liter,
          gearBoxLabel: dto.gearBoxLabel,
          seats: dto.seats,
          door: dto.door,
          ch: dto.ch,
          kw: dto.kw,
          fiscal: dto.fiscal,
          gcDate: dto.gcDate,
          registration: dto.registration,
          vehicleType: dto.vehicleType,
          co2: dto.co2,
          vat: dto.vat,
          servicingHistory: dto.servicingHistory,
          lastServicingDate: dto.lastServicingDate,
          lastServicingKm: dto.lastServicingKm,
          nextTechnicalCheckDate: dto.nextTechnicalCheckDate,
          vin: dto.vin,
          color: dto.color,
          imported: dto.imported,
          reconditioningCostsMerchant: dto.frevo,
          b2cMarketValue: dto.b2cMarketValue,
          standardMileage: dto.standardMileage,
          dpaProAmt: dto.dpaProAmt,
          salesSpeedName: dto.salesSpeedName,
          marketDataDate: dto.marketDataDate,
          marketLink: dto.marketLink,
        });
        if (vehicleOrError.isFailure) {
          return left(
            new VehicleSaleImportErrors.UnexpectedError(
              ligne,
              'can not create vehicle entity',
            ),
          );
        }
        vehicleId = await this.vehicleRepo.save(vehicleOrError.getValue());
      }

      if (createSale) {
        if (!vehicleId) {
          let vehicle;
          if (vinAnalysis === 'no') {
            vehicle = await this.vehicleRepo.getLastVehicleByRegistration(
              registration,
            );
          } else if (vinAnalysis === 'yes') {
            vehicle = await this.vehicleRepo.getLastVehicleByVin(vin);
          }
          vehicleId = vehicle?.id;
        }

        if (vehicleId) {
          const {
            acceptAuction,
            auctionStartPrice,
            acceptImmediatePurchase,
            immediatePurchasePrice,
          } = dto;
          if (acceptAuction && !auctionStartPrice)
            return left(
              new VehicleSaleImportErrors.ImportSaleFailed(
                ligne,
                vehicleId,
                'auctionStartPrice',
              ),
            );
          if (acceptImmediatePurchase && !immediatePurchasePrice)
            return left(
              new VehicleSaleImportErrors.ImportSaleFailed(
                ligne,
                vehicleId,
                'immediatePurchasePrice',
              ),
            );

          const saleProps: SaleProps = {
            validationStatus: 'DRAFT',
            supplyType: 'STOCK',
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
            vehicleId,
            groupId: dto.groupId,
          };

          // Translate comment
          if (dto?.comment) {
            saleProps.commentInt = await this.translateService.translateText(
              dto.comment,
            );
          }

          if (dto?.groupId) {
            try {
              await this.groupRepo.getGroupById(dto.groupId);
            } catch (error) {
              return left(
                new VehicleSaleImportErrors.GroupNotFound(
                  ligne,
                  vehicleId,
                  dto.groupId,
                ),
              );
            }
          }

          // Create sale entity
          const saleOrError = Sale.create(saleProps);
          if (saleOrError.isFailure) {
            return left(
              new VehicleSaleImportErrors.UnexpectedError(
                ligne,
                'create Sale Entity',
                vehicleId,
              ),
            );
          }

          const sale = saleOrError.getValue();
          // Validate sale property
          const validation = sale.validate();
          // Save sale
          if (validation.isSuccess) {
            saleId = await this.saleRepo.save(sale);
          }
        }
      }
      return right(<VehicleSaleImporCreated>{
        vehicleId,
        saleId,
      });
    } catch (err) {
      console.log(err);
      return left(new VehicleSaleImportErrors.UnexpectedError(ligne));
    }
  }

  private async identificateVehicule(
    vehicleIdentificationDto: vehicleIdentificationDto,
  ): Promise<any> {
    const { vinAnalysis, vin, registration, country } =
      vehicleIdentificationDto;
    if (vinAnalysis === 'yes') {
      return await this.apiReferentialService.getVinDetails(vin, country);
    }
    if (vinAnalysis === 'no') {
      return await this.apiReferentialService.getRegistrationDetails(
        registration,
        country,
      );
    }
  }
}
