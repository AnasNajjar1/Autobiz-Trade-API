import { DeleteSaleUseCase } from './DeleteSaleUseCase';
import { DeleteSaleController } from './DeleteSaleController';
import { saleRepo } from '../../../repos';

const deleteSaleUseCase = new DeleteSaleUseCase(saleRepo);

const deleteSaleController = new DeleteSaleController(deleteSaleUseCase);

const deleteSaleHandler = (event) => {
  return deleteSaleController.execute(event);
};

export { deleteSaleUseCase, deleteSaleController, deleteSaleHandler };
