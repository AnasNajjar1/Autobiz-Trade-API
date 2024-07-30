import { GetUsersUseCase } from './GetUsersUseCase';
import { GetUsersController } from './GetUsersController';
import { userRepo } from '../../repos';

const getUsersUseCase = new GetUsersUseCase(userRepo);

const getUsersController = new GetUsersController(getUsersUseCase);

export { getUsersUseCase, getUsersController };
