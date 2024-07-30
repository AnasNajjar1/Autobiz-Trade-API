import { GetSaleInfoUseCase } from './GetSaleInfoUseCase';
import { GetSaleInfoController } from './GetSaleInfoController';
import { saleRepo } from '../../../repos';
import { loggerService } from '../../../../../infra/logger';

const getSaleInfoUseCase = new GetSaleInfoUseCase(saleRepo);

const getSaleInfoController = new GetSaleInfoController(
  loggerService,
  getSaleInfoUseCase,
);

const getSaleInfoHandler = (event) => {
  return getSaleInfoController.execute(event);
};

export { getSaleInfoUseCase, getSaleInfoController, getSaleInfoHandler };
