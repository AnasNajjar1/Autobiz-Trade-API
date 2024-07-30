import { GetSaleByUuidUseCase } from './GetSaleByUuidUseCase';
import { GetSaleByUuidController } from './GetSaleByUuidController';
import { saleRepo } from '../../../repos';
import { saleService } from '../../../domain/services';
import { loggerService } from '../../../../../infra/logger';

const getSaleByUuidUseCase = new GetSaleByUuidUseCase(saleRepo, saleService);

const getSaleByUuidController = new GetSaleByUuidController(
  loggerService,
  getSaleByUuidUseCase,
);

const getSaleByUuidHandler = (event) => {
  return getSaleByUuidController.execute(event);
};

export { getSaleByUuidUseCase, getSaleByUuidController, getSaleByUuidHandler };
