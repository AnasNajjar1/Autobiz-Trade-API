import { DeleteUserByIdUseCase } from './DeleteUserByIdUseCase';
import { DeleteUserByIdController } from './DeleteUserByIdController';
import { userRepo } from '../../repos';

const deleteUserByIdUseCase = new DeleteUserByIdUseCase(userRepo);

const deleteUserByIdController = new DeleteUserByIdController(
  deleteUserByIdUseCase,
);

export { deleteUserByIdUseCase, deleteUserByIdController };
