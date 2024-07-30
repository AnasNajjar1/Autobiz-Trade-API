import { FindOrCreateGroupUseCase } from './FindOrCreateGroupUseCase';
import { groupRepo } from '../../repos';

const findOrCreateGroupUseCase = new FindOrCreateGroupUseCase(groupRepo);

export { findOrCreateGroupUseCase };
