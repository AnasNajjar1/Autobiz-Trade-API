import { GetAdminSaleByIdUseCase } from './GetAdminSaleByIdUseCase';
import { GetAdminSaleByIdController } from './GetAdminSaleByIdController';
import { saleRepo } from '../../../repos';

const getAdminSaleByIdUseCase = new GetAdminSaleByIdUseCase(saleRepo);

const getAdminSaleByIdController = new GetAdminSaleByIdController(
  getAdminSaleByIdUseCase,
);

const getAdminSaleByIdHandler = (event) => {
  return getAdminSaleByIdController.execute(event);
};

export {
  getAdminSaleByIdUseCase,
  getAdminSaleByIdController,
  getAdminSaleByIdHandler,
};
