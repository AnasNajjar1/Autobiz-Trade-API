import { GetAdminSalesUseCase } from './GetAdminSalesUseCase';
import { GetAdminSalesController } from './GetAdminSalesController';
import { saleRepo } from '../../../repos';
import { ApiUserService } from '../../../../../infra/autobizApi/ApiUserService/ApiUserService';

const userService = new ApiUserService();
const getAdminSalesUseCase = new GetAdminSalesUseCase(saleRepo, userService);

const getAdminSalesController = new GetAdminSalesController(
  getAdminSalesUseCase,
);

const getAdminSalesHandler = (event) => {
  return getAdminSalesController.execute(event);
};

export { getAdminSalesUseCase, getAdminSalesController, getAdminSalesHandler };
