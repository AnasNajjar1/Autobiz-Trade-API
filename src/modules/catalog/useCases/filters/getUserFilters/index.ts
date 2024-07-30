import { GetUserFiltersUseCase } from './GetUserFiltersUseCase';
import { GetUserFiltersController } from './GetUserFiltersController';
import { saleRepo } from '../../../repos';
import { listRepo } from '../../../../list/repos/';

const getUserFiltersUseCase = new GetUserFiltersUseCase(saleRepo, listRepo);

const getUserFiltersController = new GetUserFiltersController(
  getUserFiltersUseCase,
);

const getUserFiltersHandler = (event) => {
  return getUserFiltersController.execute(event);
};

export {
  getUserFiltersUseCase,
  getUserFiltersController,
  getUserFiltersHandler,
};
