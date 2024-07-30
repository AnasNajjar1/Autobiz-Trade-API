import { GetListsByUserUseCase } from './GetListsByUserUseCase';
import { GetListsByUserController } from './GetListsByUserController';
import { listRepo } from '../../repos';

const getListsByUserUseCase = new GetListsByUserUseCase(listRepo);

const getListsByUserController = new GetListsByUserController(
  getListsByUserUseCase,
);

export { getListsByUserUseCase, getListsByUserController };

export const getListsByUserHandler = (event) => {
  return getListsByUserController.execute(event);
};
