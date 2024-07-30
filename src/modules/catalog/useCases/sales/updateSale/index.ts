import { UpdateSaleUseCase } from './UpdateSaleUseCase';
import { UpdateSaleController } from './UpdateSaleController';
import { saleRepo } from '../../../repos';
import { saleService } from '../../../domain/services';
import { messengerService } from '../../../../../infra/messenger';
import { translateService } from '../../../../../infra/translate';

const updateSaleUseCase = new UpdateSaleUseCase(
  saleRepo,
  messengerService,
  saleService,
  translateService,
);

const updateSaleController = new UpdateSaleController(updateSaleUseCase);

const updateSaleHandler = (event) => {
  return updateSaleController.execute(event);
};

export { updateSaleUseCase, updateSaleController, updateSaleHandler };
