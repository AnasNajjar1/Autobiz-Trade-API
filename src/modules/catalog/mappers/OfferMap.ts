import { Mapper } from '../../../core/infra/Mapper';
import { Offer } from '../domain/offer';
import { OffersEnOfSaleNotificationDto } from '../dtos/offerDto';

export class OfferMap implements Mapper<Offer> {
  public static toDomain(raw: any): Offer {
    const offerOrError = Offer.create(
      {
        amount: raw.amount,
        offerType: raw.offerType,
        userId: raw.userId,
        saleId: raw.saleId,
        createdAt: raw.createdAt,
      },
      raw.id,
    );

    offerOrError.isFailure ? console.warn(offerOrError.error) : '';

    return offerOrError.isSuccess ? offerOrError.getValue() : null;
  }

  public static async toPersistence(offer: Offer): Promise<any> {
    return {
      amount: offer.amount,
      offerType: offer.offerType,
      userId: offer.userId,
      saleId: offer.saleId,
      createdAt: offer.createdAt,
    };
  }

  public static toEnOfSaleNotificationDto(
    offer: Offer,
  ): OffersEnOfSaleNotificationDto {
    return {
      userId: offer.userId,
    };
  }

  public static toAdminFullDto(raw: any): any {
    return {
      id: raw.id,
      amount: raw.amount,
      offerType: raw.offerType,
      userId: raw.userId,
      saleId: raw.saleId,
      createdAt: raw.createdAt,
      sale: {
        supplyType: raw.sale.supplyType,
        auctionStartPrice: raw.sale.auctionStartPrice,
        auctionReservePrice: raw.sale.auctionReservePrice,
        immediatePurchasePrice: raw.sale.immediatePurchasePrice,
        acceptImmediatePurchase: raw.sale.acceptImmediatePurchase,
        acceptAuction: raw.sale.acceptAuction,
        vehicle: {
          mileage: raw.sale.vehicle.mileage,
          fileNumber: raw.sale.vehicle.fileNumber,
          brandLabel: raw.sale.vehicle.brandLabel,
          modelLabel: raw.sale.vehicle.modelLabel,
          versionLabel: raw.sale.vehicle.versionLabel,
          b2cMarketValue: raw.sale.vehicle.b2cMarketValue,
          registration: raw.sale.vehicle.registration,
        },
        salesStat: {
          status: raw.sale.salesStat.status,
        },
      },
      offerIsWinner:
        (raw.sale.assignedWinner && raw.sale.assignedWinnerOffer === raw.id) ||
        (!raw.sale.assignedWinner &&
          raw.sale.winner &&
          raw.offerType === raw.sale.bestOfferType &&
          (raw.sale.bestAuction === raw.amount ||
            raw.sale.immediatePurchasePrice === raw.amount)),
    };
  }
  public static toPublicFullDto(row: any): any {
    return {
      id: row.id,
      amount: row.amount,
      offerType: row.offerType,
      userId: row.userId,
      saleId: row.saleId,
      createdAt: row.createdAt,
      sale: {
        supplyType: row.sale.supplyType,
        auctionStartPrice: row.sale.auctionStartPrice,
        auctionReservePrice: row.sale.auctionReservePrice,
        immediatePurchasePrice: row.sale.immediatePurchasePrice,
        vehicle: {
          mileage: row.sale.vehicle.mileage,
          fileNumber: row.sale.vehicle.fileNumber,
          brandLabel: row.sale.vehicle.brandLabel,
          modelLabel: row.sale.vehicle.modelLabel,
          versionLabel: row.sale.vehicle.versionLabel,
          entryStockDate: row.sale.vehicle.entryStockDate,
          pointofsale: {
            name: row.sale.vehicle.pointofsale.name,
          },
        },
      },
      winnerSale:
        !!(
          row.sale.assignedWinner && row.sale.assignedWinnerOffer === row.id
        ) ||
        (!row.sale.assignedWinner &&
          row.sale.winner &&
          row.offerType === row.sale.bestOfferType &&
          (row.sale.bestAuction === row.amount ||
            row.sale.immediatePurchasePrice === row.amount))
          ? 'yesReserved'
          : '-',
    };
  }
}
