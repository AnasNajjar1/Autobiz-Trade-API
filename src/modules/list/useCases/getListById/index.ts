import { GetListByIdUseCase } from './GetListByIdUseCase';
import { GetListByIdController } from './GetListByIdController';
import { listRepo } from '../../repos';

const getListByIdUseCase = new GetListByIdUseCase(listRepo);

const getListByIdController = new GetListByIdController(getListByIdUseCase);

const handler = (event) => {
  return getListByIdController.execute(event);
};

export { getListByIdUseCase, getListByIdController, handler };
