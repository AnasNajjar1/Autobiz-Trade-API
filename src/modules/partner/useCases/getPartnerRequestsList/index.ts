import { GetPartnerRequestsListUseCase } from './GetPartnerRequestsListUseCase';
import { GetPartnerRequestsListController } from './GetPartnerRequestsListController';
import { partnerRequestRepo } from '../../repos';

const getPartnerRequestsListUseCase = new GetPartnerRequestsListUseCase(
  partnerRequestRepo,
);

const getPartnerRequestsListController = new GetPartnerRequestsListController(
  getPartnerRequestsListUseCase,
);

export { getPartnerRequestsListUseCase, getPartnerRequestsListController };
