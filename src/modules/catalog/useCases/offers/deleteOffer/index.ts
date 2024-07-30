import { DeleteOfferUseCase } from './DeleteOfferUseCase';
import { DeleteOfferController } from './DeleteOfferController';
import { offerRepo } from '../../../repos';

const deleteOfferUseCase = new DeleteOfferUseCase(offerRepo);

const deleteOfferController = new DeleteOfferController(deleteOfferUseCase);

const deleteOfferHandler = (event) => {
  return deleteOfferController.execute(event);
};

export { deleteOfferUseCase, deleteOfferController, deleteOfferHandler };
