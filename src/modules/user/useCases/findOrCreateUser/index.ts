import { FindOrCreateUserUseCase } from './FindOrCreateUserUseCase';
import { userRepo } from '../../repos';

const findOrCreateUserUseCase = new FindOrCreateUserUseCase(userRepo);

export { findOrCreateUserUseCase };
