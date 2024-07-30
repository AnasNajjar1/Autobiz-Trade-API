import { GetUserByIdUseCase } from './GetUserByIdUseCase';
import { GetUserByIdController } from './GetUserByIdController';
import { userRepo } from '../../repos';

const getUserByIdUseCase = new GetUserByIdUseCase(userRepo);

const getUserByIdController = new GetUserByIdController(getUserByIdUseCase);

export { getUserByIdUseCase, getUserByIdController };
