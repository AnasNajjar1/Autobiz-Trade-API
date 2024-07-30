import { GetPartnersListUseCase } from './GetPartnersListUseCase';
import { GetPartnersListController } from './GetPartnersListController';
import { partnerRepo } from '../../repos';

const getPartnersListUseCase = new GetPartnersListUseCase(partnerRepo);

const getPartnersListController = new GetPartnersListController(
  getPartnersListUseCase,
);

export { getPartnersListUseCase, getPartnersListController };
