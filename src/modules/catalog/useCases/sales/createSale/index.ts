import { CreateSaleUseCase } from './CreateSaleUseCase';
import { CreateSaleController } from './CreateSaleController';
import { saleRepo, vehicleRepo } from '../../../repos';
import { userRepo } from '../../../../user/repos';
import { groupRepo } from '../../../../group/repos';
import { translateService } from '../../../../../infra/translate';

const createSaleUseCase = new CreateSaleUseCase(
  saleRepo,
  vehicleRepo,
  userRepo,
  groupRepo,
  translateService,
);

const createSaleController = new CreateSaleController(createSaleUseCase);

const createSaleHandler = (event) => {
  return createSaleController.execute(event);
};

export { createSaleUseCase, createSaleController, createSaleHandler };
