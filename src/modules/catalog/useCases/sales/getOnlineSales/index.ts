import { GetOnlineSalesUseCase } from './GetOnlineSalesUseCase';
import { GetOnlineSalesController } from './GetOnlineSalesController';
import { saleRepo } from '../../../repos';
import { loggerService } from '../../../../../infra/logger';

const getOnlineSalesUseCase = new GetOnlineSalesUseCase(saleRepo);

const getOnlineSalesController = new GetOnlineSalesController(
  loggerService,
  getOnlineSalesUseCase,
);

const getOnlineSalesHandler = (event) => {
  return getOnlineSalesController.execute(event);
};

export {
  getOnlineSalesUseCase,
  getOnlineSalesController,
  getOnlineSalesHandler,
};
