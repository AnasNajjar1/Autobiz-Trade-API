import { OfferAmount } from './../domain/offerAmount';
import { AssignedWinnerNotificationUseCase } from './../../mailer/useCases/assignedWinnerNotification/AssignedWinnerNotificationUseCase';
import { Mapper } from '../../../core/infra/Mapper';
import { GroupMap } from '../../group/mappers/GroupMap';
import { UserMap } from '../../user/mappers/UserMap';
import { Sale } from '../domain/sale';
import {
  SaleAdminDto,
  SaleInfosDto,
  SalePublicFullDto,
  SaleNotificationDto,
  EndOfSaleNotificationDto,
  AssignedWinnerSaleNotificationDto,
} from '../dtos/saleDto';
import { SalePublicShortDto } from '../dtos/saleDto';
import { OfferMap } from './OfferMap';
import { VehicleMap } from './VehicleMap';
import moment from 'moment';
import { bestOffererDetailsMap } from './bestOffererDetailsMap';

export class SaleMap implements Mapper<Sale> {
  public static toDomain(raw: any): Sale {
    const saleOrError = Sale.create(
      {
        userInfo: raw.userInfo ? raw.userInfo : null,
        uuid: raw.uuid,
        validationStatus: raw.validationStatus,
        supplyType: raw.supplyType,
        immediatePurchasePrice: raw.immediatePurchasePrice,
        acceptAuction: raw.acceptAuction,
        acceptImmediatePurchase: raw.acceptImmediatePurchase,
        auctionStartPrice: raw.auctionStartPrice,
        auctionStepPrice: raw.auctionStepPrice,
        auctionReservePrice: raw.auctionReservePrice,
        acceptSubmission: raw.acceptSubmission,
        startDateTime: raw.startDateTime,
        endDateTime: raw.endDateTime,
        vehicleId: raw.vehicleId,
        vehicle: raw.vehicle ? VehicleMap.toDomain(raw.vehicle) : undefined,
        secondsBeforeStart: raw.salesStat?.secondsBeforeStart,
        secondsBeforeEnd: raw.salesStat?.secondsBeforeEnd,
        status: raw.salesStat?.status,
        isBookmarkedByUser: raw.salebookmarks?.length > 0 ? true : false,
        comment: raw.comment,
        commentInt: raw.commentInt ? JSON.parse(raw.commentInt) : null,
        listId: raw.listId,
        carcheckId: raw.carcheckId,
        expressSale: raw.expressSale,
        groupId: raw.groupId,
        group: raw.group ? GroupMap.toDomain(raw.group) : undefined,
        ownerId: raw.ownerId,
        owner: raw.user ? UserMap.toDomain(raw.user) : undefined,
        assignedWinner: raw.assignedWinner,
        bestOfferer: raw.bestOfferer,
        winner: raw.winner,
        createdBy: raw.createdBy,
        bestOfferType: raw.bestOfferType,
        assignedWinnerOffer: raw.assignedWinnerOffer,
        minimalAuction: raw.minimalAuction,
        bestAuction: raw.bestAuction,
        countOffers: raw.countOffers ? raw.countOffers : 0,
        countAuctions: raw.countAuctions ? raw.countAuctions : 0,
        offers: raw.saleoffers
          ? raw.saleoffers.map((o) => OfferMap.toDomain(o))
          : [],
      },
      raw.id,
    );

    saleOrError.isFailure ? console.warn(saleOrError.error) : '';

    return saleOrError.isSuccess ? saleOrError.getValue() : null;
  }

  public static toDomainAll(raw: any): Sale {
    if (raw.saleoffers) {
      raw.saleoffers = '[' + raw.saleoffers + ']';
      raw.saleoffers = JSON.parse(raw.saleoffers);
    }
    if (raw.user) {
      raw.user = JSON.parse(raw.user);
    }
    const vehicle = {
      id: raw.vehicleId,
      uuid: raw.vehicleUuid,
      fileNumber: raw.vehicleFileNumber,
      registration: raw.vehicleRegistration,
      brandLabel: raw.vehicleBrandLabel,
      modelLabel: raw.vehicleModelLabel,
      color: raw.vehicleColor,
      versionLabel: raw.vehicleVersionLabel,
      firstRegistrationDate: raw.vehicleFirstRegistrationDate,
      fuelLabel: raw.vehicleFuelLabel,
      mileage: raw.vehicleMileage,
      carPictures: raw.vehicleCarPictures,
      profileBodyCosts: raw.vehicleProfileBodyCosts,
      pointOfSaleId: raw.vehiclePointOfSaleId,
      pointofsale: {
        uuid: raw.pointOfSaleUuid,
        name: raw.pointOfSaleName,
        city: raw.pointOfSaleCity,
        zipCode: raw.pointOfSaleZipCode,
        country: raw.pointOfSaleCountry,
      },
      thumbnail: raw.vehicleThumbnail,
    };

    const saleOrError = Sale.create(
      {
        userInfo: raw.userInfo ? raw.userInfo : null,
        uuid: raw.uuid,
        validationStatus: raw.validationStatus,
        supplyType: raw.supplyType,
        immediatePurchasePrice: raw.immediatePurchasePrice,
        acceptAuction: Boolean(raw.acceptAuction),
        acceptImmediatePurchase: Boolean(raw.acceptImmediatePurchase),
        auctionStartPrice: raw.auctionStartPrice,
        auctionStepPrice: raw.auctionStepPrice,
        auctionReservePrice: raw.auctionReservePrice,
        acceptSubmission: Boolean(raw.acceptSubmission),
        startDateTime: raw.startDateTime,
        endDateTime: raw.endDateTime,
        vehicleId: raw.vehicleId,
        vehicle: vehicle ? VehicleMap.toDomain(vehicle) : undefined,
        secondsBeforeStart: raw.salesStatSecondsBeforeStart,
        secondsBeforeEnd: raw.salesStatSecondsBeforeEnd,
        status: raw.salesStatStatus,
        isBookmarkedByUser: raw.salebookmarks.length > 0 ? true : false,
        comment: raw.comment,
        commentInt: raw.commentInt ? JSON.parse(raw.commentInt) : null,
        listId: raw.listId,
        carcheckId: raw.carcheckId,
        expressSale: raw.expressSale,
        groupId: raw.groupId,
        ownerId: raw.ownerId,
        owner: raw.user ? UserMap.toDomain(raw.user) : undefined,
        assignedWinner: raw.assignedWinner,
        createdBy: raw.createdBy,
        bestOfferer: raw.bestOfferer,
        winner: raw.winner,
        bestOfferType: raw.bestOfferType,

        minimalAuction: raw.minimalAuction,
        bestAuction: raw.bestAuction,
        countOffers: raw.countOffers ? raw.countOffers : 0,
        countAuctions: raw.countAuctions ? raw.countAuctions : 0,
        offers: raw.saleoffers
          ? raw.saleoffers.map((o) => OfferMap.toDomain(o))
          : [],
      },
      raw.id,
    );

    saleOrError.isFailure ? console.warn(saleOrError.error) : '';

    return saleOrError.isSuccess ? saleOrError.getValue() : null;
  }

  public static toPublicShortDto(sale: Sale): SalePublicShortDto {
    return {
      userInfo: sale.userInfo,
      uuid: sale.uuid,
      supplyType: sale.supplyType,
      acceptAuction: sale.acceptAuction,
      acceptImmediatePurchase: sale.acceptImmediatePurchase,
      acceptSubmission: sale.acceptSubmission,
      countAuctions: sale.countAuctions,
      bestAuction: sale.bestAuction,
      auctionStartPrice: sale.auctionStartPrice,
      auctionStepPrice: sale.auctionStepPrice,
      immediatePurchasePrice: sale.immediatePurchasePrice,
      startDateTime: sale.startDateTime,
      endDateTime: sale.endDateTime,
      secondsBeforeStart: sale.secondsBeforeStart,
      secondsBeforeEnd: sale.secondsBeforeEnd,
      status: sale.status,
      comment: sale.comment,
      commentInt: sale.commentInt,
      url: sale.getUrl(),
      vehicle: sale.vehicle ? VehicleMap.toPublicShortDto(sale.vehicle) : null,
      isBookmarkedByUser: sale.isBookmarkedByUser,
      isSold: sale.isSold(),
    };
  }

  public static toPublicFullDto(sale: Sale): SalePublicFullDto {
    return {
      uuid: sale.uuid,
      supplyType: sale.supplyType,
      acceptAuction: sale.acceptAuction,
      acceptImmediatePurchase: sale.acceptImmediatePurchase,
      acceptSubmission: sale.acceptSubmission,
      countAuctions: sale.countAuctions,
      bestAuction: sale.bestAuction,
      auctionStartPrice: sale.auctionStartPrice,
      auctionStepPrice: sale.auctionStepPrice,
      immediatePurchasePrice: sale.immediatePurchasePrice,
      startDateTime: sale.startDateTime,
      endDateTime: sale.endDateTime,
      secondsBeforeEnd: sale.secondsBeforeEnd,
      status: sale.status,
      vehicle: sale.vehicle ? VehicleMap.toPublicFullDto(sale.vehicle) : null,
      comment: sale.comment,
      commentInt: sale.commentInt,
      isBookmarkedByUser: sale.isBookmarkedByUser,
    };
  }

  public static toPublicSaleInfosDto(sale: Sale, userId: string): SaleInfosDto {
    return {
      uuid: sale.uuid,
      supplyType: sale.supplyType,
      countAuctions: sale.countAuctions,
      bestAuction: sale.bestAuction,
      auctionStartPrice: sale.auctionStartPrice,
      auctionStepPrice: sale.auctionStepPrice,
      auctionReservePrice: sale.auctionReservePrice,
      auctionReservePriceIsReached: sale.auctionReservePriceIsReached,
      immediatePurchasePrice: sale.immediatePurchasePrice,
      endDateTime: sale.endDateTime,
      secondsBeforeStart: sale.secondsBeforeStart,
      secondsBeforeEnd: sale.secondsBeforeEnd,
      status: sale.status,
      minimalAuction: sale.minimalAuction,
      isSubmissionOpen: sale.isSubmissionOpen,
      isAuctionOpen: sale.isAuctionOpen,
      isImmediatePurchaseOpen: sale.isImmediatePurchaseOpen,
      bestOffer: sale.bestOffer(),
      isSold: sale.isSold(),
      userInfo: sale.userInfo,
      isOwner: sale.isOwner(userId),
    };
  }

  public static toAdminDto(sale: Sale): SaleAdminDto {
    return {
      id: sale.id,
      uuid: sale.uuid,
      validationStatus: sale.validationStatus,
      supplyType: sale.supplyType,
      acceptAuction: sale.acceptAuction,
      acceptImmediatePurchase: sale.acceptImmediatePurchase,
      acceptSubmission: sale.acceptSubmission,
      countAuctions: sale.countAuctions,
      auctionStartPrice: sale.auctionStartPrice,
      auctionStepPrice: sale.auctionStepPrice,
      auctionReservePrice: sale.auctionReservePrice,
      immediatePurchasePrice: sale.immediatePurchasePrice,
      startDateTime: sale.startDateTime,
      endDateTime: sale.endDateTime,
      status: sale.status,
      countOffers: sale.countOffers,
      requestWinner: sale.requestWinner,
      deleteWinner: sale.deleteWinner,
      winner: sale.winner,
      bestOfferer: sale.bestOfferer,

      url: sale.getUrl(),
      comment: sale.comment,
      commentInt: sale.commentInt,
      listId: sale.listId,
      carcheckId: sale.carcheckId,
      expressSale: sale.expressSale,
      groupId: sale.groupId,
      ownerId: sale.ownerId,
      vehicle: sale.vehicle ? VehicleMap.toAdminShortDto(sale.vehicle) : null,
      vehicleId: sale.vehicleId,
      createdBy: sale.createdBy,
      group: sale.group ? GroupMap.toDto(sale.group) : null,
      bestOffer: sale.bestOfferAmount,
      bestOfferType: sale.bestOfferType,
      bestOffererDetails: sale.bestOffererDetails
        ? bestOffererDetailsMap.toAdminDto(sale.bestOffererDetails)
        : sale.bestOffererDetails,
    };
  }

  public static async toPersistence(sale: Sale): Promise<any> {
    return {
      uuid: sale.uuid,
      validationStatus: sale.validationStatus,
      supplyType: sale.supplyType,
      acceptAuction: sale.acceptAuction,
      acceptImmediatePurchase: sale.acceptImmediatePurchase,
      acceptSubmission: sale.acceptSubmission,
      auctionStartPrice: sale.auctionStartPrice,
      auctionStepPrice: sale.auctionStepPrice,
      auctionReservePrice: sale.auctionReservePrice,
      immediatePurchasePrice: sale.immediatePurchasePrice,
      startDateTime: sale.startDateTime,
      endDateTime: sale.endDateTime,
      vehicleId: sale.vehicleId,
      comment: sale.comment,
      commentInt: sale.commentInt ? JSON.stringify(sale.commentInt) : null,
      listId: sale.listId,
      carcheckId: sale.carcheckId,
      expressSale: sale.expressSale,
      ownerId: sale.ownerId,
      groupId: sale.groupId,
      assignedWinner: sale.assignedWinner,
      assignedWinnerOffer: sale.assignedWinnerOffer,
      winner: sale.winner,
      createdBy: sale.createdBy,
      updatedBy: sale.updatedBy,
    };
  }

  public static toSaleNotificationDto(sale: Sale): SaleNotificationDto {
    return {
      fileNumber: sale.vehicle.fileNumber.value,
      brandLabel: sale.vehicle.brandLabel,
      modelLabel: sale.vehicle.modelLabel,
      versionLabel: sale.vehicle.versionLabel || '',
      mileage: sale.vehicle.mileage,
      pointofsaleName: sale.vehicle.pointofsale.name,
      uuid: sale.uuid,
      carPicture:
        sale.vehicle.carPictures.value.three_quarters_front_picture || '',
    };
  }

  public static toEndOfSaleNotificationDto(
    sale: Sale,
  ): EndOfSaleNotificationDto {
    let offerWinner;
    if (sale.offers.length > 0)
      offerWinner = sale.offers
        .filter((offer) => offer.userId === sale.winner)
        .map((o) => o.amount);
    const maxAmount = Math.max(...offerWinner);
    const offer = sale.offers.find((offr) => offr.amount === maxAmount);
    return {
      fileNumber: sale.vehicle.fileNumber.value,
      brandLabel: sale.vehicle.brandLabel,
      modelLabel: sale.vehicle.modelLabel,
      versionLabel: sale.vehicle.versionLabel,
      mileage: sale.vehicle.mileage,
      uuid: sale.uuid,
      winner: sale.winner,
      city: sale.vehicle.pointofsale.city,
      paymentDeadline: sale.vehicle.pointofsale?.paymentDeadline || '/',
      pickupDeadline: sale.vehicle.pointofsale?.pickupDeadline || '/',
      comments: sale.vehicle.pointofsale?.comments || '/',
      pdfReport: getPdfReportLink(sale),
      firstRegistrationDateYear: parseInt(sale.vehicle.firstRegistrationDate), //issue in Vehicle Map, not format Date
      offers: sale.offers.map((o) => OfferMap.toEnOfSaleNotificationDto(o)),
      offerAmount: offer?.amount,
      offerCreatedAt: offer?.createdAt?.toString(),
      link: `${process.env.siteUrl}/records/${sale.uuid}`,
    };
  }
  public static toAssignedWinnerSaleNotificationDto(
    sale: Sale,
  ): AssignedWinnerSaleNotificationDto {
    let offerWinner;
    if (sale.offers.length > 0)
      offerWinner = sale.offers.find(
        (offer) => offer.id === sale.assignedWinnerOffer,
      );
    return {
      offerAmount: offerWinner.amount
        ? offerWinner.amount.toLocaleString('fr-FR')
        : offerWinner.amount,
      fileNumber: sale.vehicle.fileNumber.value,
      supplyType: sale.supplyType,
      brandLabel: sale.vehicle.brandLabel,
      modelLabel: sale.vehicle.modelLabel,
      versionLabel: sale.vehicle.versionLabel,
      mileage: sale.vehicle.mileage,
      uuid: sale.uuid,
      winner: sale.winner,
      paymentDeadline: sale.vehicle.pointofsale?.paymentDeadline || '/',
      pickupDeadline: sale.vehicle.pointofsale?.pickupDeadline || '/',
      comments: sale.vehicle.pointofsale?.comments || '/',
      POS_name: sale.vehicle.pointofsale.name,
      POS_zipCode: sale.vehicle.pointofsale.zipCode,
      POS_city: sale.vehicle.pointofsale.city,
      offerCreatedAt: offerWinner?.createdAt,
      entryStockDate: moment(sale.vehicle.entryStockDate).format('DD/MM/YYYY'),
      link: `${process.env.siteUrl}/records/${sale.uuid}`,
      pdfReport: getPdfReportLink(sale),
      firstRegistrationDateYear: parseInt(sale.vehicle.firstRegistrationDate),
      offers: sale.offers.map((o) => OfferMap.toEnOfSaleNotificationDto(o)),
      city: sale.vehicle.pointofsale.city,
    };
  }
}

function getPdfReportLink(sale: Sale): string {
  let pdfReport = '';
  sale.vehicle.documents?.value?.forEach((doc) => {
    if (doc.title === 'pdfReport') pdfReport = doc.link;
  });
  return pdfReport;
}
