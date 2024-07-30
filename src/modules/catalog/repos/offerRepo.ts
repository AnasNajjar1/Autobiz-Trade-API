import { Offer } from '../domain/offer';

export interface IOfferRepo {
  getAdminOffers(search: any): Promise<any>;
  getOffers(search: any): Promise<any>;
  delete(id: number): Promise<void>;
  save(offer: Offer): Promise<void>;
}
