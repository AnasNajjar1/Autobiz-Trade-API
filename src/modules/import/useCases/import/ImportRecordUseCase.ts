import Axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { left, Result, Either, right } from '../../../../core/logic/Result';
import { IImportRecordRepo } from '../../repos/importRecordRepo';
import { IImportQuotationRepo } from '../../repos/importQuotationRepo';
import { UseCase } from '../../../../core/logic/UseCase';
import { AppError } from '../../../../core/logic/AppError';
import schema from '../../../../shared/schemas/mappingB2B-carcheck.json';
import countries from '../../../../shared/lists/countries';
import equipments from '../../../../shared/schemas/equipments.json';
import { transformJson } from './transformJson';

import { ImportRecordRequestDto } from './ImportRecordRequestDto';
import { ImportRecordErrors } from './ImportRecordErrors';
import { createPointofsaleUseCase } from '../../../pointofsale/useCases/createPointofsale';
import { createVehicleUseCase } from '../../../catalog/useCases/vehicles/createVehicle';

import { copyImage, saveFile } from '../../../../infra/fileStorage/s3-lib';
import { CreateVehicleRequestDto } from '../../../catalog/useCases/vehicles/createVehicle/CreateVehicleRequestDto';
import {
  translateVehiclesColors,
  getVehiclesPicturesOthers,
} from '../../../../shared/helpers/VehicleHelper';

type Response = Either<
  | AppError.UnexpectedError
  | ImportRecordErrors.RecordNotFoundError
  | ImportRecordErrors.SaleIsNotProperlyDefined
  | ImportRecordErrors.GroupError
  | ImportRecordErrors.VehicleError,
  Result<{ id: number }>
>;

export class ImportRecordUseCase
  implements UseCase<ImportRecordRequestDto, Promise<Response>>
{
  private importRecordRepo: IImportRecordRepo;
  private importQuotationRepo: IImportQuotationRepo;

  constructor(
    importRecordRepo: IImportRecordRepo,
    importQuotationRepo: IImportQuotationRepo,
  ) {
    this.importRecordRepo = importRecordRepo;
    this.importQuotationRepo = importQuotationRepo;
  }

  public async execute(dto: ImportRecordRequestDto): Promise<Response> {
    const sources = {
      1: 'carcheck',
      2: 'mobile',
      3: 'psar',
      4: 'gaap',
      5: 'test',
      6: 'porsche',
      7: 'pilote',
    };

    try {
      const { sale } = dto;
      const {
        id: carcheckId,
        status,
        offerType,
        userId,
        buyerId,
        country: countryUser,
      } = dto;

      let record = await this.importRecordRepo.getRecordDetail(carcheckId);
      const { sourceId, countryId, formId } = record.record;

      const country = countries[countryId];

      let source;
      try {
        source = await this.importRecordRepo.getSource(sourceId); //sources[sourceId]; // à remplacer lorsque api prete
      } catch (e) {
        source = sources[sourceId];
      }

      const elementCheckedData = _.get(record, 'elementChecked', null);
      let lastServicingKm = _.get(record, 'km_since_last_servicing', null);
      let secondKey;
      let userManual;
      if (elementCheckedData) {
        secondKey = await this.checkElement(
          elementCheckedData,
          'label_second_set_keys',
        );
        userManual = await this.checkElement(
          elementCheckedData,
          'label_manuel',
        );
      }

      // Recharging market datas
      record = await this.getMarketDatas(record, country);

      const transformedJson = transformJson(record, schema);

      // If versionLabel is not defined in valuation.versionName,  get vehicle.versionList
      const versionList = _.get(record, 'vehicle.versionList', '');
      if (!transformedJson.versionLabel && versionList) {
        transformedJson.versionLabel = versionList;
      }

      //----------------------------------------------------------
      // Create / update Import Point of sale -> get pointOfSaleId

      let pointofsaleResult;
      if (_.get(record, 'expertise.pointOfSaleId', false)) {
        pointofsaleResult = await createPointofsaleUseCase.execute({
          action: 'import',
          autobizPosId: record.expertise.pointOfSaleId,
          country,
        });
        console.warn(
          'import pointofsale from record.expertise.pointOfSaleId :' +
            record.expertise.pointOfSaleId,
        );
      } else {
        //FIXME: create duplicates with same name ex : STG recordId 16146
        pointofsaleResult = await createPointofsaleUseCase.execute({
          action: 'create',
          city: _.get(record, 'carcheckPointOfSale.city', ''),
          country: _.toLower(country),
          name: _.get(record, 'carcheckPointOfSale.name', ''),
          zipCode: _.get(record, 'carcheckPointOfSale.zipCode', ''),
        });
      }

      if (pointofsaleResult.isLeft()) {
        console.warn(
          'error point of sale' + pointofsaleResult.value.error.message,
        );
        return left(
          new ImportRecordErrors.PointOfSaleError(
            pointofsaleResult.value.error.message,
          ),
        );
      }
      const pointOfSaleId = pointofsaleResult.value.getValue()._id;
      console.warn('pointOfSaleId set to :' + pointOfSaleId);

      const inspection: any = await this.importRecordRepo.getInspection(formId); //promise

      const carColorInspection = this.getInspectionCarColor(
        inspection.inspection?.children,
      );

      const registration = _.get(
        inspection.inspection.vehicle,
        'registration',
        '',
      );

      //copy images, make them public, and return url

      let imagesDict: any = this.copyImages(inspection.documents[0]); //promise

      const report = this.flattenReport(inspection.inspection.report);
      //extract list of vehicle pictures
      const gallery: any = {};

      //calculation of last servicing km based on mileage and km since last servicing
      if (transformedJson.kmSinceLastServicing && transformedJson.mileage) {
        try {
          lastServicingKm =
            transformedJson.mileage - transformedJson.kmSinceLastServicing;
        } catch (e) {
          console.warn('error with lastServicingKm calculation', e.message);
        }
      }

      Object.entries(report).forEach(([key, value]) => {
        if (key !== 'other_car_pictures' && key.includes('_picture'))
          gallery[key] = value;
      });
      const damages = [];
      //photos dommages
      const data = _.get(inspection.inspection, 'damages', []);

      const referential = Object.keys(
        _.get(inspection.inspection.report, 'totals', { external: null }),
      )[0]; // take only 1 referential to avoid damage duplication

      data.forEach((damage) => {
        if (referential === damage.referential && damage.cost !== 0) {
          damages.push(this.getDamages(damage));
        }
        if (damage.damage_picture !== null && damage.damage_picture !== '') {
          gallery[damage.element] = damage.damage_picture;
        }
        if (damage.damage_picture2 !== null && damage.damage_picture2 !== '') {
          gallery[`${damage.element}_2`] = damage.damage_picture2;
        }
      });

      const listAccidents = _.get(inspection.inspection.report, 'crash', []);
      if (listAccidents) {
        const paintingAnomaly =
          _.get(inspection.inspection.report, 'crash.painting_anomaly[1]', [])
            .length > 0;
        const trunkFloorImage = _.get(
          inspection.inspection.report,
          'crash.body_rear_trunk_floor_image[1]',
          '',
        );

        const paintingTest = _.get(
          inspection.inspection.report,
          'crash.painting_test[1]',
        );
        Object.entries(listAccidents).forEach(([key, value]) => {
          if (key === 'painting_anomaly' && !paintingAnomaly) return;
          if (key === 'accident' && paintingTest === 'no') return;
          if (key === 'body_rear_trunk_floor_image') return;
          if (key === 'body_rear_trunk_floor_image2') return;
          if (key.startsWith('crashed_invoice_picture')) {
            damages.push({
              element: 'crashed_invoice_picture',
              damage: key.startsWith('crashed_invoice_picture')
                ? 'crashed_invoice_picture_comment'
                : 'body_rear_trunk_floor_image_comment',
              damage_picture: _.get(value, '[1]', ''),
              damage_picture2: '',
              zone: 'crash',
            });
          } else if (key === 'body_rear_trunk_floor') {
            damages.push({
              element: key,
              damage: value[1],
              damage_picture: trunkFloorImage,
              damage_picture2: '',
              zone: 'crash',
            });
          } else {
            damages.push({
              element: key,
              damage: value[1],
              damage_picture: _.get(data, 'damage_picture', ''),
              damage_picture2: _.get(data, 'damage_picture2', ''),
              zone: 'crash',
            });
          }
        });
      }
      //replace image id with url
      imagesDict = await imagesDict;

      Object.entries(damages).forEach(([key, data]) => {
        const res = _.get(data, 'damage_picture', '');
        const res2 = _.get(data, 'damage_picture2', '');

        if (res === null) damages[key]['damage_picture'] = '';
        if (res2 === null) damages[key]['damage_picture2'] = '';
        if (res && res !== null)
          damages[key]['damage_picture'] = _.get(imagesDict, res, '');
        if (res2 && res2 !== null)
          damages[key]['damage_picture2'] = _.get(imagesDict, res2, '');
      });

      Object.entries(gallery).forEach(([key, value]) => {
        const v: any = value;
        if (key === 'motor_picture1') key = 'motor_picture';
        const url = _.get(imagesDict, v, false);
        if (url) gallery[key] = url;
        else _.unset(gallery, key);
      });
      _.unset(gallery, 'motor_picture1');

      //extract docs
      const docs = [];
      for (const key of [
        'servicing_manual_picture',
        'technical_check_picture',
      ]) {
        const doc = _.get(gallery, key, null);
        if (doc) {
          docs.push({ link: doc, title: key });
          _.unset(gallery, key);
        }
      }

      const recordKey = _.get(inspection, 'inspection.recordKey', null);
      const fileNumber = transformedJson.fileNumber;
      if (source && recordKey && fileNumber) {
        if (sourceId === 1) source = sources[sourceId]; // special case for easyreprise, which is called carcheck in the system ?
        if (sourceId === 3) source = 'carcheck'; // special case for easyreprise, which is called carcheck in the system
        docs.push({
          link: `${process.env.carcheckApiPath}/buyer/public/${source}/${recordKey}/admin-documents/${fileNumber}_rapport_d_inspection.pdf`,
          title: 'pdfReport',
        });
      }

      for (const docName of ['histovec', 'certificate_of_non-pledge']) {
        try {
          const doc = await this.getDocumenHistovec(
            'documents',
            docName,
            record.record.id,
            'display',
          );
          if (doc) {
            const fileUrl = await saveFile(doc, docName);
            docs.push({
              link: fileUrl,
              title: docName,
            });
          }
        } catch (e) {
          console.warn('failed get doc');
          console.warn(e.message);
        }
      }

      transformedJson.wheelsFrontDimensions = this.formatWheels(
        _.get(transformedJson, 'wheelsFrontDimensions.diameter', null),
      );

      transformedJson.wheelsBackDimensions = this.formatWheels(
        _.get(transformedJson, 'wheelsBackDimensions.diameter', null),
      );

      transformedJson.wheelsFrontTireBrand = _.get(
        transformedJson,
        'wheelsFrontTireBrand',
        null,
      );
      transformedJson.wheelsBackTireBrand = _.get(
        transformedJson,
        'wheelsBackTireBrand',
        null,
      );

      if (transformedJson.equipmentsVin) {
        transformedJson.constructorEquipments = this.getEquipments(
          transformedJson.equipmentsVin.split(','),
        );
      }

      if (lastServicingKm) {
        transformedJson.lastServicingKm = String(lastServicingKm);
      }

      transformedJson.registration = registration;

      transformedJson.statusId = parseInt(status.toString()) === 1 ? 1 : 4; //

      //transformedJson.sale = sale;
      transformedJson.damages = damages;
      // if (salesComment) transformedJson.salesComment = salesComment;

      transformedJson.pointofsale = { id: pointOfSaleId };
      transformedJson.offerType = offerType;
      transformedJson.country = country;
      transformedJson.userId = userId;
      //if (ownerId) transformedJson.ownerId = ownerId;
      transformedJson.documents = docs;
      transformedJson.carPictures = gallery;
      transformedJson.carPicturesOthers = getVehiclesPicturesOthers(gallery);

      transformedJson.distributionBelt = this.getDistributionBelt(
        inspection.inspection.report,
      );

      transformedJson.declaredEquipments = this.getEquipmentsReport(report);

      transformedJson.fuelLabel = this.correctValues(
        'fuels',
        transformedJson.fuelId,
      );

      transformedJson.gearBoxLabel = this.correctValues(
        'gears',
        transformedJson.gearBoxId,
      );
      transformedJson.salesSpeedName = this.correctValues(
        'salesSpeedName',
        transformedJson.salesSpeedName,
      );
      transformedJson.keyPoints = this.getKeyPoint(transformedJson);
      try {
        transformedJson.ch = this.calculateCH(transformedJson.kw).toString();
      } catch (e) {
        console.warn('cannot transform kw to ch');
      }

      //------------------------------------------
      // FIND or create vehicleId -> get vehicleId

      const vehicleRequestDto: CreateVehicleRequestDto = {
        fileNumber: transformedJson.fileNumber,
        registration: transformedJson.registration,
        purchaseDate: transformedJson.purchaseDate,
        brandLabel: transformedJson.brandLabel,
        modelLabel: transformedJson.modelLabel,
        versionLabel: transformedJson.versionLabel,
        firstRegistrationDate: transformedJson.firstRegistrationDate,
        profileCosts: transformedJson.profileCosts,
        carPictures: transformedJson.carPictures,
        carPicturesOthers: transformedJson.carPicturesOthers,
        pointofsale: { id: pointOfSaleId },
        keyPoints: transformedJson.keyPoints,
        documents: transformedJson.documents,
        declaredEquipments: transformedJson.declaredEquipments,
        constructorEquipments: transformedJson.constructorEquipments,
        mileage: transformedJson.mileage,
        fuelLabel: transformedJson.fuelLabel,
        liter: transformedJson.liter,
        gearBoxLabel: transformedJson.gearBoxLabel,
        seats: transformedJson.seats,
        door: transformedJson.door,
        ch: transformedJson.ch,
        kw: transformedJson.kw,
        fiscal: transformedJson.fiscal,
        wheelsFrontDimensions: transformedJson.wheelsFrontDimensions,
        wheelsBackDimensions: transformedJson.wheelsBackDimensions,
        wheelsFrontTireBrand: transformedJson.wheelsFrontTireBrand,
        wheelsBackTireBrand: transformedJson.wheelsBackTireBrand,
        rimTypeFront: transformedJson.rimTypeFront,
        rimTypeBack: transformedJson.rimTypeBack,
        metallic: transformedJson.metallic,
        gcDate: transformedJson.gcDate,
        firstHand: transformedJson.firstHand,
        vehicleType: transformedJson.vehicleType,
        co2: transformedJson.co2,
        origin: transformedJson.origin,
        purchaseInvoice: transformedJson.purchaseInvoice,
        vat: transformedJson.vat,
        vatDetails: transformedJson.vatDetails,
        servicingHistory: transformedJson.servicingHistory,
        servicingInBrandNetwork: transformedJson.servicingInBrandNetwork,
        servicingManualPicture: transformedJson.servicingManualPicture,
        servicingInvoices: transformedJson.servicingInvoices,
        lastServicingDate: transformedJson.lastServicingDate,
        lastServicingKm: transformedJson.lastServicingKm,
        distributionBelt: transformedJson.distributionBelt,
        nextTechnicalCheckDate: transformedJson.nextTechnicalCheckDate,
        marketLink: transformedJson.marketLink,
        b2cMarketValue: transformedJson.b2cMarketValue,
        standardMileage: transformedJson.standardMileage,
        userId: userId,
        damages: transformedJson.damages,
        userManual: userManual,
        secondSetKey: secondKey,
        imported: transformedJson.imported,
        profileBodyCosts: transformedJson.profileBodyCosts,
        vin: transformedJson.vin,
        dpaProAmt: transformedJson.dpaProAmt,
        salesSpeedName: transformedJson.salesSpeedName,
        createdBy: userId,
        entryStockDate: transformedJson.entryStockDate,
        marketDataDate: transformedJson.marketDataDate,
        color: carColorInspection,
      };

      const resultVehicleId = await createVehicleUseCase.execute(
        vehicleRequestDto,
      );

      let vehicleId: number;

      if (resultVehicleId.isRight()) {
        vehicleId = resultVehicleId.value.getValue();
      } else {
        return left(new ImportRecordErrors.VehicleError());
      }

      return right(Result.ok({ id: vehicleId }));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }

  //----------------------------------------------------
  //----------------------------------------------------
  //----------------------------------------------------
  //----------------------------------------------------
  //----------------------------------------------------
  //----------------------------------------------------

  private async checkElement(data: any, element: any) {
    if (data === null) return null;
    let response;
    Object.values(data).map((value: any) => {
      if (value.originalLabel == element) {
        response = value.present;
        return;
      }
    });
    return response;
  }

  private async copyImages(images) {
    const imagesDict = {};

    if (!images) {
      return imagesDict;
    }

    const promiseCopyImages = images.map(async (imageObject) => {
      const { id, name } = imageObject;
      imagesDict[id] = await copyImage(name);
      return;
    });
    await Promise.all(promiseCopyImages);
    return imagesDict;
  }

  private flattenReport(report) {
    const flattenReport = {};
    Object.entries(report).forEach(([sectionId, sectionContent]) => {
      //flattenReport[sectionId] = {}
      Object.entries(sectionContent).forEach(
        ([questionId, questionContent]) => {
          flattenReport[questionId] = _.get(questionContent, '[1]', null);
        },
      );
    });

    return flattenReport;
  }

  private getDamages(data) {
    const res = {
      custom_damage: _.get(data, 'custom_damage', null),
      is_custom: (_.get(data, 'is_custom', '') == true && 1) || 0,
      element: _.get(data, 'element', null),
      damage: _.get(data, 'damage', null),
      damage_picture: _.get(data, 'damage_picture', ''),
      damage_picture2: _.get(data, 'damage_picture2', ''),
      reconditionning: _.get(data, 'reconditionning', null),
      zone: _.get(data, 'zone', null),
    };
    return res;
  }

  private formatWheels(stringDimensions) {
    //205/60 R16
    try {
      return {
        diameter: stringDimensions.substr(8, 2),
        width: stringDimensions.substr(0, 3),
        height: stringDimensions.substr(4, 2),
      };
    } catch (e) {
      console.warn('error format wheels', stringDimensions);
      return null;
    }
  }

  private getEquipments(ids) {
    const equips = [];
    for (const id of ids) {
      const key = _.get(equipments, `${id}.key`, null);
      if (key) equips.push(key);
    }
    return equips;
  }
  private getDistributionBelt(report) {
    const damages = _.get(report, 'servicing.damages', []);
    for (const damage of damages) {
      if (damage.element === 'distribution_belt') return damage.reconditionning;
    }
    return null;
  }
  private getEquipmentsReport(report) {
    const equips = _.get(report, 'equipments', []);
    const airCond = _.get(report, 'air_conditionner', 'no');
    if (airCond !== 'no') equips.push(airCond);
    return equips;
  }

  //value is returned in french, here is translated value
  private correctValues(type, value) {
    const corrections = {
      fuels: {
        1: 'PETROL',
        2: 'DIESEL',
        3: 'LPG',
        4: 'ELECTRIC',
        5: 'CNG',
        6: 'ETHANOL',
        13: 'LPG',
        14: 'PETROL HYBRID',
        15: 'CNG',
        16: 'ETHANOL',
        24: 'DIESEL HYBRID',
        25: 'TRI-FUEL',
      },
      gears: {
        1: 'MANUAL',
        2: 'AUTOMATIC',
      },
      salesSpeedName: {
        'VERY FAST': 'very quick',
        FAST: 'quick',
        NORMAL: 'normal',
        SLOW: 'slow',
        'VERY SLOW': 'very slow',
      },
    };

    return _.get(corrections, `${type}.${value}`, value);
  }

  private getKeyPoint = (data) => {
    const list = [];
    Object.entries(data).map(([i, value]) => {
      if (
        ['firstHand', 'vat', 'servicingInBrandNetwork', 'imported'].includes(
          i,
        ) &&
        value === 1
      )
        list.push(i);
      if (i === 'seats' && value === 7) list.push('7seats');
      if (i === 'profileCosts') {
        if (value === 'B') list.push('fewCosts');
      }
      if (i === 'profileBodyCosts') {
        if (value === 'B' && list.indexOf('fewCosts') === -1)
          list.push('fewCosts');
      }

      if (i === 'lastServicingDate' && value) {
        //let duration = moment().diff(value, "months");
        //if (duration < 6) list.push("ctLessThan6Months");
      }
      if (i === 'purchaseInvoice' && value !== null) list.push(i);
    });

    // keypoint : dpaPromisingMarket
    if (data.dpaProAmt !== null) {
      if (data.dpaProAmt === 0) {
        list.indexOf('dpaPromisingMarket') === -1
          ? list.push('dpaPromisingMarket')
          : null;
      }
    }
    // keypoint : highDemand
    ['normal', 'quick', 'very quick'].includes(data.salesSpeedName) &&
    list.indexOf('highDemand') === -1
      ? list.push('highDemand')
      : null;

    // keypoint : essence
    if (['ESSENCE', 'PETROL'].includes(data.fuelLabel)) {
      list.indexOf('essence') === -1 ? list.push('essence') : null;
    }

    // keypoint : hybrid
    if (data.fuelLabel !== null && data.fuelLabel.includes('HYBRID')) {
      list.indexOf('hybrid') === -1 ? list.push('hybrid') : null;
    }

    // keypoint : underMileaged
    if (data.mileage !== null && data.standardMileage !== null) {
      const mileageDifference = data.mileage - data.standardMileage;
      if (mileageDifference < -20000) {
        list.indexOf('underMileaged') === -1
          ? list.push('underMileaged')
          : null;
      }
    }

    // keypoint : firstHand
    if (data.firstRegistrationDate !== null && data.gcDate !== null) {
      const firstHandDiff = moment(data.gcDate).diff(
        moment(data.firstRegistrationDate),
        'months',
        true,
      );
      if (firstHandDiff < 3) {
        list.indexOf('firstHand') === -1 ? list.push('firstHand') : null;
      }
    }

    // keypoint : smallPrice
    if (data.b2cMarketValue !== null) {
      if (data.b2cMarketValue >= 100 && data.b2cMarketValue < 7000) {
        list.indexOf('smallPrice') === -1 ? list.push('smallPrice') : null;
      }
    }

    // keypoint : recentTechnicalCheck
    if (data.nextTechnicalCheckDate !== null) {
      const nbMonthBeforeNextTechnicalCheckDate = moment().diff(
        data.nextTechnicalCheckDate,
        'months',
      );
      if (nbMonthBeforeNextTechnicalCheckDate < -15) {
        list.indexOf('recentTechnicalCheck') === -1
          ? list.push('recentTechnicalCheck')
          : null;
      }
    }

    // keypoint : readyToBuy
    if (
      data.profileBodyCosts !== null &&
      data.nextTechnicalCheckDate !== null &&
      data.lastServicingDate !== null &&
      data.mileage !== null &&
      data.kmSinceLastServicing !== null
    ) {
      if (
        data.profileBodyCosts === 'A' &&
        moment().diff(data.nextTechnicalCheckDate, 'months') < -12 && // next Technichal Check Data in month
        moment().diff(data.lastServicingDate, 'months') < 12 &&
        data.mileage - data.kmSinceLastServicing < 1000
      ) {
        list.indexOf('readyToBuy') === -1 ? list.push('readyToBuy') : null;
      }
    }

    // keypoint : fastSalesSpeed
    if (data.salesSpeedName === 'fast') {
      list.indexOf('fastSalesSpeed') === -1
        ? list.push('fastSalesSpeed')
        : null;
    }

    return list;
  };

  private calculateCH(kw) {
    return Math.round(parseInt(kw) / 0.735499);
  }

  private async getDocumenHistovec(documentType, documentName, recordId, mode) {
    const response = await Axios.get(
      `${process.env.carcheckApiPath}/buyer/record/${recordId}/documents/${documentType}/${documentName}/${mode}`,
      {
        responseType: 'arraybuffer',
        headers: {
          Accept: 'application/pdf',
          Authorization: `Bearer ${process.env.autobizApiSecretKey}`,
        },
      },
    );
    if (response.status > 299) throw Error(`doc ${documentName} missing`);
    if (response.data.length < 200) return null;
    return response.data;
  }

  private async getMarketDatas(record: any, country: string) {
    const {
      registrationDate,
      mileage,
      modelId,
      fuelId,
      gearBoxId,
      bodyId,
      door,
      brandId,
      ps,
    } = record.vehicle;
    const versionId = record.valuation.versionId || record.vehicle.versionId;
    let result = null;
    let b2cMarketValue = null;
    let standardMileage = null;
    let dpaProAmt = null;
    let salesSpeedName = null;
    let analysisLink = null;
    let marketDataDate = null;
    try {
      if (versionId) {
        const params = {
          pathParams: {
            version: versionId,
            year: moment(registrationDate.date).year(),
            mileage,
          },
          queryParams: {
            month: moment(registrationDate.date).month() + 1,
            country,
          },
        };
        result = await this.importQuotationRepo.getQuotationByVersion(params);
      } else {
        const params = {
          makeId: brandId,
          modelId,
          fuelId,
          gearId: gearBoxId,
          engine: ps,
          year: moment(registrationDate.date).year(),
          mileage,
          bodyId,
          doors: door,
          country,
        };
        result = await this.importQuotationRepo.getQuotationByReference(params);
      }
      if (result.status) {
        b2cMarketValue =
          result._quotation?.b2cMarketValue !== 0
            ? result._quotation?.b2cMarketValue
            : result._quotation?.mcclbp;
        standardMileage = result.standardMileage;
        dpaProAmt = result._marketInformation?.transactionSpread;
        salesSpeedName = result._salesSpeed?.name;
        if (country !== 'ES') analysisLink = result._links?.marketAnalysis;
        marketDataDate = moment(new Date()).format('YYYY-MM-DD');
      }
    } catch (err) {
      console.warn(err, 'Error get valuation');
    }
    return {
      ...record,
      valuation: {
        ...record.valuation,
        refPrice: b2cMarketValue,
        salesSpeedName,
        standardMileage,
        dpaAmt: dpaProAmt,
        analysisLink,
        marketDataDate,
      },
    };
  }

  private getInspectionCarColor(inspection: object) {
    let color = null;
    if (inspection) {
      Object.keys(inspection).map((key) => {
        const section = inspection[key];
        if (section.children?.color) color = section.children?.color?.value;
      });
    }
    return color;
  }
}
