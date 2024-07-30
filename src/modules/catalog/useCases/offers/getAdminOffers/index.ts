import { GetAdminOffersUseCase } from './GetAdminOffersUseCase';
import { GetAdminOffersController } from './GetAdminOffersController';
import { offerRepo } from '../../../repos';

const getAdminOffersUseCase = new GetAdminOffersUseCase(offerRepo);

const getAdminOffersController = new GetAdminOffersController(
  getAdminOffersUseCase,
);

const getAdminOffersHandler = (event) => {
  return getAdminOffersController.execute(event);
};
export {
  getAdminOffersUseCase,
  getAdminOffersController,
  getAdminOffersHandler,
};
