import { UpdateGroupUseCase } from './UpdateGroupUseCase';
import { UpdateGroupController } from './UpdateGroupController';
import { groupRepo } from '../../repos';

const updateGroupUseCase = new UpdateGroupUseCase(groupRepo);

const updateGroupController = new UpdateGroupController(updateGroupUseCase);

export { updateGroupUseCase, updateGroupController };
