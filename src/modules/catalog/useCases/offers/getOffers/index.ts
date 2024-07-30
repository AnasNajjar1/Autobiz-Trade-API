import { GetOffersUseCase } from './GetOffersUseCase';
import { GetOffersController } from './GetOffersController';
import { offerRepo } from '../../../repos';

const getOffersUseCase = new GetOffersUseCase(offerRepo);

const getOffersController = new GetOffersController(getOffersUseCase);

const getOffersHandler = (event) => {
  return getOffersController.execute(event);
};
export { getOffersUseCase, getOffersController, getOffersHandler };
