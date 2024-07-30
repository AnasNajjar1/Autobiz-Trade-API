import { Mapper } from '../../../core/infra/Mapper';

import { VehicleFileNumber } from '../domain/vehicleFileNumber';
import { VehicleProfileCosts } from '../domain/vehicleProfileCosts';
import { VehicleCarPictures } from '../domain/vehicleCarPictures';
import { VehicleCarPicturesOthers } from '../domain/vehicleCarPicturesOthers';
import { VehicleKeyPoints } from '../domain/vehicleKeyPoints';
import { VehicleDocuments } from '../domain/vehicleDocuments';
import { VehicleDeclaredEquipments } from '../domain/vehicleDeclaredEquipments';
import { VehicleConstructorEquipments } from '../domain/vehicleConstructorEquipments';
import { VehicleWheelsDimension } from '../domain/vehicleWheelsDimensions';
import { VehicleDamages } from '../domain/vehicleDamages';
import { Vehicle } from '../domain/vehicle';
import { VehicleAdminShortDto } from '../dtos/vehicleDto';
import { PointofsaleMap } from '../../pointofsale/mappers/PointofsaleMap';
import {
  VehiclePublicShortDto,
  VehiclePublicFullDto,
  VehicleAdminFullDto,
} from '../dtos/vehicleDto';
import { vehicleRepo } from '../repos';

export class VehicleMap implements Mapper<Vehicle> {
  public static toDomain(raw: any): Vehicle {
    const vehicleOrError = Vehicle.create(
      {
        uuid: raw.uuid,
        fileNumber: VehicleFileNumber.create(raw.fileNumber).getValue(),
        registration: raw.registration,
        purchaseDate: raw.purchaseDate,
        brandLabel: raw.brandLabel,
        modelLabel: raw.modelLabel,
        versionLabel: raw.versionLabel,
        firstRegistrationDate: raw.firstRegistrationDate,
        profileCosts: VehicleProfileCosts.create(raw.profileCosts).getValue(),
        carPictures: VehicleCarPictures.create(raw.carPictures).getValue(),
        carPicturesOthers: VehicleCarPicturesOthers.create(
          raw.carPicturesOthers,
        ).getValue(),
        keyPoints: VehicleKeyPoints.create(raw.keyPoints).getValue(),
        documents: VehicleDocuments.create(raw.documents).getValue(),
        declaredEquipments: VehicleDeclaredEquipments.create(
          raw.declaredEquipments,
        ).getValue(),
        constructorEquipments: VehicleConstructorEquipments.create(
          raw.constructorEquipments,
        ).getValue(),
        mileage: raw.mileage,
        fuelLabel: raw.fuelLabel,
        liter: raw.liter,
        gearBoxLabel: raw.gearBoxLabel,
        seats: raw.seats,
        door: raw.door,
        ch: raw.ch,
        kw: raw.kw,
        fiscal: raw.fiscal,
        wheelsFrontDimensions: VehicleWheelsDimension.create(
          raw.wheelsFrontDimensions,
        ).getValue(),
        wheelsBackDimensions: VehicleWheelsDimension.create(
          raw.wheelsBackDimensions,
        ).getValue(),
        wheelsFrontTireBrand: raw.wheelsFrontTireBrand,
        wheelsBackTireBrand: raw.wheelsBackTireBrand,
        rimTypeFront: raw.rimTypeFront,
        rimTypeBack: raw.rimTypeBack,
        metallic: raw.metallic,
        gcDate: raw.gcDate,
        firstHand: raw.firstHand,
        vehicleType: raw.vehicleType,
        co2: raw.co2,

        userManual: raw.userManual,
        secondSetKey: raw.secondSetKey,
        damages: VehicleDamages.create(raw.damages).getValue(),
        profileBodyCosts: VehicleProfileCosts.create(
          raw.profileBodyCosts,
        ).getValue(),
        vin: raw.vin,
        pointofsale: raw.pointofsale
          ? PointofsaleMap.toDomain(raw.pointofsale)
          : undefined,

        //HISTORY
        origin: raw.origin,
        purchaseInvoice: raw.purchaseInvoice,
        vat: raw.vat,
        vatDetails: raw.vatDetails,
        imported: raw.imported,

        //SERVICING
        servicingHistory: raw.servicingHistory,
        servicingInBrandNetwork: raw.servicingInBrandNetwork,
        servicingManualPicture: raw.servicingManualPicture,
        servicingInvoices: raw.servicingInvoices,
        lastServicingDate: raw.lastServicingDate,
        lastServicingKm: raw.lastServicingKm,
        distributionBelt: raw.distributionBelt,
        nextTechnicalCheckDate: raw.nextTechnicalCheckDate,
        //MARKET
        b2cMarketValue: raw.b2cMarketValue,
        standardMileage: raw.standardMileage,
        dpaProAmt: raw.dpaProAmt,
        salesSpeedName: raw.salesSpeedName,
        marketLink: raw.marketLink,
        marketDataDate: raw.marketDataDate,

        userId: raw.userId,
        createdAt: raw.createdAt,
        entryStockDate: raw.entryStockDate,
        color: raw.color,
        reconditioningCostsMerchant: raw.reconditioningCostsMerchant,
        thumbnail: raw.thumbnail,
      },
      raw.id,
    );

    vehicleOrError.isFailure ? console.warn(vehicleOrError.error) : '';

    return vehicleOrError.isSuccess ? vehicleOrError.getValue() : null;
  }

  public static toPublicShortDto(vehicle: Vehicle): VehiclePublicShortDto {
    return {
      uuid: vehicle.uuid,
      brandLabel: vehicle.brandLabel,
      modelLabel: vehicle.modelLabel,
      versionLabel: vehicle.versionLabel,
      profileBodyCosts: vehicle.profileBodyCosts?.value,
      featuredPicture: vehicle.featuredPicture,
      firstRegistrationDate: vehicle.firstRegistrationDate,
      mileage: vehicle.mileage,
      gallery: vehicle.fundamentalPictures(),
      fuelLabel: vehicle.fuelLabel,
      pointofsale: vehicle.pointofsale
        ? PointofsaleMap.toPublicShortDto(vehicle.pointofsale)
        : undefined,
      b2cMarketValue: vehicle.b2cMarketValue,
      standardMileage: vehicle.standardMileage,
      dpaProAmt: vehicle.dpaProAmt,
      salesSpeedName: vehicle.salesSpeedName
    };
  }

  public static toPublicFullDto(vehicle: Vehicle): VehiclePublicFullDto {
    return {
      uuid: vehicle.uuid,
      fileNumber: vehicle.fileNumber?.value,
      registration: vehicle.registration,
      purchaseDate: vehicle.purchaseDate,
      brandLabel: vehicle.brandLabel,
      modelLabel: vehicle.modelLabel,
      versionLabel: vehicle.versionLabel,

      profileCosts: vehicle.profileCosts?.value,
      keyPoints: vehicle.keyPoints?.value,
      documents: vehicle.documents?.value,
      declaredEquipments: vehicle.declaredEquipments?.value,
      constructorEquipments: vehicle.constructorEquipments?.value,
      rankedConstructorEquipments: vehicle.rankedConstructorEquipments(),

      damages: vehicle.damages?.value,
      profileBodyCosts: vehicle.profileBodyCosts?.value,
      vin: vehicle.vin,

      gallery: vehicle.gallery(),
      pointofsale: vehicle.pointofsale
        ? PointofsaleMap.toPublicFullDto(vehicle.pointofsale)
        : undefined,

      entryStockDate: vehicle.entryStockDate,

      characteristics: {
        mileage: vehicle.mileage,
        firstRegistrationDate: vehicle.firstRegistrationDate,
        fuelLabel: vehicle.fuelLabel,
        liter: vehicle.liter,
        gearBoxLabel: vehicle.gearBoxLabel,
        seats: vehicle.seats,
        door: vehicle.door,
        color: vehicle.color,
        metallic: vehicle.metallic,
        power: {
          ch: vehicle.ch,
          kw: vehicle.kw,
        },
        fiscal: vehicle.fiscal,
        wheelsFrontDimensions: vehicle.wheelsFrontDimensions?.value,
        wheelsBackDimensions: vehicle.wheelsBackDimensions?.value,
        wheelsFrontTireBrand: vehicle.wheelsFrontTireBrand,
        wheelsBackTireBrand: vehicle.wheelsBackTireBrand,
        rimTypeFront: vehicle.rimTypeFront,
        rimTypeBack: vehicle.rimTypeBack,
      },

      administrativeDetails: {
        gcDate: vehicle.gcDate,
        firstHand: vehicle.firstHand,
        vehicleType: vehicle.vehicleType,
        co2: vehicle.co2,
        userManual: vehicle.userManual,
        secondSetKey: vehicle.secondSetKey,
      },

      history: {
        origin: vehicle.origin,
        purchaseInvoice: vehicle.purchaseInvoice,
        vat: vehicle.vat,
        vatDetails: vehicle.vatDetails,
        imported: vehicle.imported,
      },

      //SERVICING
      servicing: {
        servicingHistory: vehicle.servicingHistory,
        servicingInBrandNetwork: vehicle.servicingInBrandNetwork,
        servicingManualPicture: vehicle.servicingManualPicture,
        servicingInvoices: vehicle.servicingInvoices,
        lastServicingDate: vehicle.lastServicingDate,
        lastServicingKm: vehicle.lastServicingKm,
        distributionBelt: vehicle.distributionBelt,
        nextTechnicalCheckDate: vehicle.nextTechnicalCheckDate,
      },

      //FREVO
      frevo: {
        reconditioningCostsMerchant: vehicle.reconditioningCostsMerchant,
      },

      //MARKET
      market: {
        b2cMarketValue: vehicle.b2cMarketValue,
        standardMileage: vehicle.standardMileage,
        dpaProAmt: vehicle.dpaProAmt,
        salesSpeedName: vehicle.salesSpeedName,
        marketLink: vehicle.marketLink,
        marketDataDate: vehicle.marketDataDate,
      },
    };
  }

  public static toAdminShortDto(vehicle: Vehicle): VehicleAdminShortDto {
    return {
      id: vehicle.id,
      fileNumber: vehicle.fileNumber?.value,
      registration: vehicle.registration,
      brandLabel: vehicle.brandLabel,
      modelLabel: vehicle.modelLabel,
      versionLabel: vehicle.versionLabel,
      fuelLabel: vehicle.fuelLabel,
      mileage: vehicle.mileage,
      firstRegistrationDate: vehicle.firstRegistrationDate,
      pointofsale: vehicle.pointofsale
        ? PointofsaleMap.toAdminShortDto(vehicle.pointofsale)
        : null,
      createdAt: vehicle.createdAt,
      //MARKET
      b2cMarketValue: vehicle.b2cMarketValue,
      standardMileage: vehicle.standardMileage,
      dpaProAmt: vehicle.dpaProAmt,
      salesSpeedName: vehicle.salesSpeedName,
    };
  }

  public static toAdminFullDto(vehicle: Vehicle): VehicleAdminFullDto {
    return {
      id: vehicle.id,
      uuid: vehicle.uuid,
      fileNumber: vehicle.fileNumber?.value,
      registration: vehicle.registration,
      purchaseDate: vehicle.purchaseDate,
      brandLabel: vehicle.brandLabel,
      modelLabel: vehicle.modelLabel,
      versionLabel: vehicle.versionLabel,
      firstRegistrationDate: vehicle.firstRegistrationDate,
      profileCosts: vehicle.profileCosts?.value,
      keyPoints: vehicle.keyPoints?.value,
      documents: vehicle.documents?.value,
      declaredEquipments: vehicle.declaredEquipments?.value,
      constructorEquipments: vehicle.constructorEquipments?.value,
      mileage: vehicle.mileage,
      fuelLabel: vehicle.fuelLabel,
      liter: vehicle.liter,
      gearBoxLabel: vehicle.gearBoxLabel,
      seats: vehicle.seats,
      door: vehicle.door,
      ch: vehicle.ch,
      kw: vehicle.kw,
      fiscal: vehicle.fiscal,
      wheelsFrontDimensions: vehicle.wheelsFrontDimensions?.value,
      wheelsBackDimensions: vehicle.wheelsBackDimensions?.value,
      wheelsFrontTireBrand: vehicle.wheelsFrontTireBrand,
      wheelsBackTireBrand: vehicle.wheelsBackTireBrand,
      rimTypeFront: vehicle.rimTypeFront,
      rimTypeBack: vehicle.rimTypeBack,
      metallic: vehicle.metallic,
      gcDate: vehicle.gcDate,
      firstHand: vehicle.firstHand,
      vehicleType: vehicle.vehicleType,
      co2: vehicle.co2,

      userManual: vehicle.userManual,
      secondSetKey: vehicle.secondSetKey,
      damages: vehicle.damages?.value,
      profileBodyCosts: vehicle.profileBodyCosts?.value,
      vin: vehicle.vin,
      entryStockDate: vehicle.entryStockDate,

      pointofsale: vehicle.pointofsale
        ? PointofsaleMap.toAdminShortDto(vehicle.pointofsale)
        : undefined,
      carPictures: vehicle.carPictures?.value,
      carPicturesOthers: vehicle.carPicturesOthers?.value,
      carPicturesMain: vehicle.carPicturesMain,

      //HISTORY
      origin: vehicle.origin,
      purchaseInvoice: vehicle.purchaseInvoice,
      vat: vehicle.vat,
      vatDetails: vehicle.vatDetails,
      imported: vehicle.imported,

      //SERVICING
      servicingHistory: vehicle.servicingHistory,
      servicingInBrandNetwork: vehicle.servicingInBrandNetwork,
      servicingManualPicture: vehicle.servicingManualPicture,
      servicingInvoices: vehicle.servicingInvoices,
      lastServicingDate: vehicle.lastServicingDate,
      lastServicingKm: vehicle.lastServicingKm,
      distributionBelt: vehicle.distributionBelt,
      nextTechnicalCheckDate: vehicle.nextTechnicalCheckDate,
      //MARKET
      b2cMarketValue: vehicle.b2cMarketValue,
      standardMileage: vehicle.standardMileage,
      dpaProAmt: vehicle.dpaProAmt,
      salesSpeedName: vehicle.salesSpeedName,
      marketLink: vehicle.marketLink,
      marketDataDate: vehicle.marketDataDate,
      userId: vehicle.userId,
      color: vehicle.color,
      reconditioningCostsMerchant: vehicle.reconditioningCostsMerchant,
    };
  }

  public static async toPersistence(vehicle: Vehicle): Promise<any> {
    return {
      uuid: vehicle.uuid,
      fileNumber: vehicle.fileNumber?.value,
      vin: vehicle.vin,
      color: vehicle.color,
      brandLabel: vehicle.brandLabel,
      modelLabel: vehicle.modelLabel,
      versionLabel: vehicle.versionLabel,
      firstRegistrationDate: vehicle.firstRegistrationDate,
      profileCosts: vehicle.profileCosts?.value,
      profileBodyCosts: vehicle.profileBodyCosts?.value,

      carPictures: vehicle.carPictures?.value
        ? JSON.stringify(vehicle.carPictures.value)
        : null,

      carPicturesOthers: vehicle.carPicturesOthers?.value
        ? JSON.stringify(vehicle.carPicturesOthers.value)
        : null,

      damages: vehicle.damages?.value
        ? JSON.stringify(vehicle.damages.value)
        : null,

      pointOfSaleId: vehicle.pointOfSaleId,

      keyPoints: vehicle.keyPoints?.value
        ? JSON.stringify(vehicle.keyPoints.value)
        : null,
      documents: vehicle.documents?.value
        ? JSON.stringify(vehicle.documents.value)
        : null,

      declaredEquipments: vehicle.declaredEquipments?.value
        ? JSON.stringify(vehicle.declaredEquipments.value)
        : null,

      constructorEquipments: vehicle.constructorEquipments?.value
        ? JSON.stringify(vehicle.constructorEquipments.value)
        : null,

      mileage: vehicle.mileage,
      fuelLabel: vehicle.fuelLabel,
      liter: vehicle.liter,
      gearBoxLabel: vehicle.gearBoxLabel,
      seats: vehicle.seats,
      door: vehicle.door,
      ch: vehicle.ch,
      kw: vehicle.kw,
      fiscal: vehicle.fiscal,
      wheelsFrontDimensions: vehicle.wheelsFrontDimensions?.value
        ? JSON.stringify(vehicle.wheelsFrontDimensions.value)
        : null,
      wheelsBackDimensions: vehicle.wheelsBackDimensions?.value
        ? JSON.stringify(vehicle.wheelsBackDimensions.value)
        : null,
      wheelsFrontTireBrand: vehicle.wheelsFrontTireBrand,
      wheelsBackTireBrand: vehicle.wheelsBackTireBrand,
      rimTypeFront: vehicle.rimTypeFront,
      rimTypeBack: vehicle.rimTypeBack,
      metallic: vehicle.metallic,

      purchaseDate: vehicle.purchaseDate,
      gcDate: vehicle.gcDate,
      registration: vehicle.registration,
      firstHand: vehicle.firstHand,
      vehicleType: vehicle.vehicleType,
      co2: vehicle.co2,
      userManual: vehicle.userManual,
      secondSetKey: vehicle.secondSetKey,

      origin: vehicle.origin,
      purchaseInvoice: vehicle.purchaseInvoice,
      vat: vehicle.vat,
      vatDetails: vehicle.vatDetails,
      imported: vehicle.imported,

      servicingHistory: vehicle.servicingHistory,
      servicingInBrandNetwork: vehicle.servicingInBrandNetwork,
      servicingManualPicture: vehicle.servicingManualPicture,
      servicingInvoices: vehicle.servicingInvoices,
      lastServicingDate: vehicle.lastServicingDate,
      lastServicingKm: vehicle.lastServicingKm,
      distributionBelt: vehicle.distributionBelt,
      nextTechnicalCheckDate: vehicle.nextTechnicalCheckDate,

      reconditioningCostsMerchant: vehicle.reconditioningCostsMerchant,

      b2cMarketValue: vehicle.b2cMarketValue,
      standardMileage: vehicle.standardMileage,
      dpaProAmt: vehicle.dpaProAmt,
      salesSpeedName: vehicle.salesSpeedName,
      marketLink: vehicle.marketLink,
      marketDataDate: vehicle.marketDataDate,

      userId: vehicle.userId,
      createdBy: vehicle.createdBy,
      updatedBy: vehicle.updatedBy,
      entryStockDate: vehicle.entryStockDate,
      thumbnail: vehicle.thumbnail,
    };
  }
}
