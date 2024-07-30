import { DeleteListByIdUseCase } from './DeleteListByIdUseCase';
import { DeleteListByIdController } from './DeleteListByIdController';
import { listRepo } from '../../repos';

const deleteListByIdUseCase = new DeleteListByIdUseCase(listRepo);

const deleteListByIdController = new DeleteListByIdController(
  deleteListByIdUseCase,
);

export { deleteListByIdUseCase, deleteListByIdController };
