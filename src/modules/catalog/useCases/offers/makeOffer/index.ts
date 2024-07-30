import { MakeOfferUseCase } from './MakeOfferUseCase';
import { MakeOfferController } from './MakeOfferController';
import { saleRepo, offerRepo } from '../../../repos';

const makeOfferUseCase = new MakeOfferUseCase(saleRepo, offerRepo);

const makeOfferController = new MakeOfferController(makeOfferUseCase);

const makeOfferHandler = (event) => {
  return makeOfferController.execute(event);
};

export { makeOfferUseCase, makeOfferController, makeOfferHandler };
