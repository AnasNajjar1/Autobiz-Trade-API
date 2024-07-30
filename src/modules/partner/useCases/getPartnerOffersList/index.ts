import { GetPartnerOffersListUseCase } from './GetPartnerOffersListUseCase';
import { GetPartnerOffersListController } from './GetPartnerOffersListController';
import { partnerOfferRepo } from '../../repos';

const getPartnerOffersListUseCase = new GetPartnerOffersListUseCase(
  partnerOfferRepo,
);

const getPartnerOffersListController = new GetPartnerOffersListController(
  getPartnerOffersListUseCase,
);

export { getPartnerOffersListUseCase, getPartnerOffersListController };
