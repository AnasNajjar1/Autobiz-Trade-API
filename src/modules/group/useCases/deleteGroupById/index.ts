import { DeleteGroupByIdUseCase } from './DeleteGroupByIdUseCase';
import { DeleteGroupByIdController } from './DeleteGroupByIdController';
import { groupRepo } from '../../repos';

const deleteGroupByIdUseCase = new DeleteGroupByIdUseCase(groupRepo);

const deleteGroupByIdController = new DeleteGroupByIdController(
  deleteGroupByIdUseCase,
);

export { deleteGroupByIdUseCase, deleteGroupByIdController };
