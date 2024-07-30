import { GetAggregationsUseCase } from './GetAggregationsUseCase';
import { GetAggregationsController } from './GetAggregationsController';
import { saleRepo } from '../../../repos';
import { loggerService } from '../../../../../infra/logger';

const getAggregationsUseCase = new GetAggregationsUseCase(saleRepo);

const getAggregationsController = new GetAggregationsController(
  loggerService,
  getAggregationsUseCase,
);

const getAggregationsHandler = (event) => {
  return getAggregationsController.execute(event);
};

export {
  getAggregationsUseCase,
  getAggregationsController,
  getAggregationsHandler,
};
