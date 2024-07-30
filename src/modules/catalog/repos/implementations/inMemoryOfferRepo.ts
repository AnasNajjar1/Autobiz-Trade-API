import { IOfferRepo } from '../offerRepo';
import { OfferMap } from '../../mappers/OfferMap';
import { Offer } from '../../domain/offer';

export class InMemoryOfferRepo implements IOfferRepo {
  private mockedOffers;

  public constructor(mock?: any) {
    this.mockedOffers = mock;
  }
  public getAdminOffers(): Promise<void> {
    return;
  }
  public getOffers(): Promise<void> {
    return;
  }

  public delete(): Promise<void> {
    return;
  }

  public save(offer: Offer): Promise<void> {
    const rawOffer: any = OfferMap.toPersistence(offer);
    return;
  }
}
