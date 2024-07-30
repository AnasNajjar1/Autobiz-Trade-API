import { DeletePointofsaleByIdUseCase } from './DeletePointofsaleByIdUseCase';
import { DeletePointofsaleByIdController } from './DeletePointofsaleByIdController';
import { pointofsaleRepo } from '../../repos';

const deletePointofsaleByIdUseCase = new DeletePointofsaleByIdUseCase(
  pointofsaleRepo,
);

const deletePointofsaleByIdController = new DeletePointofsaleByIdController(
  deletePointofsaleByIdUseCase,
);

export { deletePointofsaleByIdUseCase, deletePointofsaleByIdController };
