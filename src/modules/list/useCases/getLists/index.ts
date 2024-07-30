import { GetListsUseCase } from './GetListsUseCase';
import { GetListsController } from './GetListsController';
import { listRepo } from '../../repos';

const getListsUseCase = new GetListsUseCase(listRepo);

const getListsController = new GetListsController(getListsUseCase);

export { getListsUseCase, getListsController };
