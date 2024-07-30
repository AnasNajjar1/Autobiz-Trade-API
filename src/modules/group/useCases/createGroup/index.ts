import { CreateGroupUseCase } from './CreateGroupUseCase';
import { CreateGroupController } from './CreateGroupController';
import { groupRepo } from '../../repos';

const createGroupUseCase = new CreateGroupUseCase(groupRepo);

const createGroupController = new CreateGroupController(createGroupUseCase);

export { createGroupUseCase, createGroupController };
