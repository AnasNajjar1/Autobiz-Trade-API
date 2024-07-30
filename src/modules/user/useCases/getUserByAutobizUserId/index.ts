import { GetUserByAutobizUserIdUseCase } from './GetUserByAutobizUserIdUseCase';
import { GetUserByAutobizUserIdController } from './GetUserByAutobizUserIdController';
import { userRepo } from '../../repos';

const getUserByAutobizUserIdUseCase = new GetUserByAutobizUserIdUseCase(
  userRepo,
);

const getUserByAutobizUserIdController = new GetUserByAutobizUserIdController(
  getUserByAutobizUserIdUseCase,
);

export const getUserByAutobizUserIdHandler = (event) => {
  return getUserByAutobizUserIdController.execute(event);
};

export { getUserByAutobizUserIdUseCase, getUserByAutobizUserIdController };
