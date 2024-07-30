import { UpdateUserUseCase } from './UpdateUserUseCase';
import { UpdateUserController } from './UpdateUserController';
import { userRepo } from '../../repos';

const updateUserUseCase = new UpdateUserUseCase(userRepo);

const updateUserController = new UpdateUserController(updateUserUseCase);

export { updateUserUseCase, updateUserController };
